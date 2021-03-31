import { createSlice } from "@reduxjs/toolkit";
import API from "../../axios";
import { normalLoader, skeletonLoader } from "./loaderSlice";
import { baseURL, token as authToken } from "../../axios";
// import {updateSharePrivacy} from './shareSlice'

export const structureSlice = createSlice({
  name: "structure",
  initialState: {
    currentDisplayStructure: [],
    currentPath: [
      {
        name: "ROOT",
        id: "ROOT",
      },
    ],
  },
  reducers: {
    updateStructure: (state, action) => {
      state.currentDisplayStructure = action.payload.children;
    },
    pushToCurrentStack: (state, action) => {
      let res = action.payload;
      res.resData.type = res.type;
      state.currentDisplayStructure.unshift(res.resData);
    },
    updateFileName: (state, action) => {
      let res = action.payload.data;
      let index = action.payload.index;
      if (state.currentDisplayStructure[index] !== undefined) {
        state.currentDisplayStructure[index].name = res.name;
      }
    },
    updatePrivacy: (state, action) => {
      let res = action.payload;
      console.log(res);
      state.currentDisplayStructure[res.key].privacy = res.payload.privacy;
    },
    updateFav: (state, action) => {
      let res = action.payload;
      state.currentDisplayStructure[res.key].favourite = res.payload.favourite;
    },
    popFromCurrentStack: (state, action) => {
      let res = action.payload;
      console.log(res);
      function check(data) {
        return parseInt(res.data.id) === data.id && res.type === data.type;
      }
      let index = state.currentDisplayStructure.findIndex(check);

      console.log(index);

      if (index !== -1) {
        state.currentDisplayStructure.splice(index, 1);
      }
    },
    updatePath: (state, action) => {
      state.currentPath = action.payload;
    },
  },
});

export const {
  updateStructure,
  pushToCurrentStack,
  updateFileName,
  popFromCurrentStack,
  updateFav,
  updatePath,
  updatePrivacy,
} = structureSlice.actions;

export const structureAsync = (uni_id) => (dispatch) => {
  console.log("Sending request for /api/folder/");
  dispatch(skeletonLoader());
  API.get(`/api/folder/`, {
    params: {
      id: uni_id,
    },
  })
    .then((res) => {
      dispatch(updateStructure(res.data));
      dispatch(skeletonLoader());
    })
    .catch((err) => {
      console.log(err);
      dispatch(skeletonLoader());
    });
};

export const addFolderAsync = (data) => (dispatch) => {
  dispatch(normalLoader());
  API.post("/api/folder/", data)
    .then((res) => {
      console.log(res);
      let newData = {
        resData: res.data,
        type: "folder",
      };
      dispatch(pushToCurrentStack(newData));
      dispatch(normalLoader());
    })
    .catch((err) => {
      console.log(err);
      dispatch(normalLoader());
    });
};

export const addFavouriteAsync = (data) => (dispatch) => {
  if (data.type === "file") {
    API.patch("/api/file/", data.payload)
      .then((res) => {
        dispatch(updateFav(data));
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    API.patch("/api/folder/", data.payload)
      .then((res) => {
        dispatch(updateFav(data));
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

export const privacyAsync = (data) => (dispatch) => {
  if (data.type === "file") {
    API.patch("/api/file/", data.payload)
      .then((res) => {
        dispatch(updatePrivacy(data));
        // dispatch(updateSharePrivacy())
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    API.patch("/api/folder/", data.payload)
      .then((res) => {
        dispatch(updatePrivacy(data));
        // dispatch(updateSharePrivacy())
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

export const pathAsync = (data) => (dispatch) => {
  console.log("asking for path ");
  console.log("token now = ", window.localStorage.getItem("session"));
  API.get(`/api/path/`, {
    params: {
      id: data.id,
      TYPE: data.type,
    },
  })
    .then((res) => {
      console.log("updating path for id = ", data, " with ", res);
      dispatch(updatePath(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

function download(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  // the filename you want
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
export const getFileAsync = (data) => (dispatch) => {
  dispatch(normalLoader());
  fetch(`${baseURL}/api/file/stream-file/?id=${data}`, {
    crossDomain: true,
    method: "get",
    headers: {
      Authorisation: `Token ${authToken}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    // .then((res) => res.blob())
    .then((blob) => {
      console.log("in blobbbbbbbbbbbbbb", blob);
      // download(blob, "yahi hai file bete");
      dispatch(normalLoader());
      console.log(data);
    })
    .catch((err) => {
      dispatch(normalLoader());
      console.error("trail with blob ", err);
    });

  // API.get(`/api/file/stream-file/`, {
  //   params: {
  //     id: data,
  //   },
  // })
  //   .then((res) => res.blob())
  //   .then((blob) => {
  //     console.log("in blobbbbbbbbbbbbbb");
  //     download(blob, "yahi hai file bete");
  //     dispatch(normalLoader());
  //   })
  //   .catch((err) => {
  //     console.log("ommaago its an errro", err);
  //     dispatch(normalLoader());
  //   });
};

export const selectStructure = (state) =>
  state.structure.currentDisplayStructure;
export const navStructure = (state) => state.structure.currentPath;

export default structureSlice.reducer;
