from itertools import chain

# django
from rest_framework import serializers
from .models import Folder
from django.contrib.humanize.templatetags import humanize
from django.contrib.auth.models import User
from file.serializers import FileSerializer

from user.serializers import UserSerializer


class FolderSerializerWithoutChildren(serializers.ModelSerializer):

    created_at = serializers.SerializerMethodField()
    last_modified = serializers.SerializerMethodField()
    shared_among = serializers.SerializerMethodField()
    owner = UserSerializer(read_only=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        exclude = ('present_in_shared_me_of',)
        # ordering = ['-last_modified']

    def get_type(self, obj):
        return "folder"

    def get_created_at(self, obj):
        return humanize.naturaltime(obj.created_at)

    def get_last_modified(self, obj):
        return humanize.naturaltime(obj.last_modified)

    def get_shared_among(self, obj):
        data = UserSerializer(obj.shared_among.all(), many=True).data
        return data


class FolderSerializer(FolderSerializerWithoutChildren):

    children = serializers.SerializerMethodField()

    def get_children(self, obj):
        # folders
        folders = obj.children_folder.filter(trash=False)
        folders = FolderSerializerWithoutChildren(folders, many=True).data

        # files
        files = obj.children_file.filter(trash=False)
        files = FileSerializer(files, many=True).data
        for file in files:
            file["type"] = "file"

        result_list = list(chain(folders, files))
        return result_list
