import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { emphasize, withStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Chip from "@material-ui/core/Chip";
import HomeIcon from "@material-ui/icons/Home";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FolderIcon from "@material-ui/icons/Folder";

import {
  selectPath,
  getFolderPickerView,
  pathAsync,
} from "../../../store/slices/moveSlice";

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[300],
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

export default function CustomizedBreadcrumbs(props) {
  // const dispatch = useDispatch();
  let nav = [];
  nav = useSelector(selectPath);

  const dispatch = useDispatch();

  let updateFolderView = (e, key) => {
    e.preventDefault();
    console.log("key called", key);
    dispatch(getFolderPickerView(key));
    dispatch(pathAsync({ id: key, type: "FOLDER" }));
  };

  let renderNav = nav.map((data) => {
    return (
      <StyledBreadcrumb
        key={data.id}
        component="a"
        href="#"
        label={data.name}
        icon={
          data.id === "HOME" ? (
            <HomeIcon fontSize="small" />
          ) : (
            <FolderIcon fontSize="small" />
          )
        }
        style={{ marginTop: "5px" }}
        onClick={(e) => updateFolderView(e, data.id)}
      />
    );
  });

  return (
    <Breadcrumbs style={{ margin: "10px" }} aria-label="breadcrumb">
      {renderNav}
    </Breadcrumbs>
  );
}
