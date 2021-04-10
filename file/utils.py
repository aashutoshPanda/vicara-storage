import boto3
import secrets
import os
from mysite.settings import AWS_STORAGE_BUCKET_NAME

from .models import File

from folder.utils import propagate_size_change


def create_file(owner, req_file, parent, req_file_name, size):
    new_file = File(owner=owner, file=req_file,
                    parent=parent, name=req_file_name,
                    size=size, privacy=parent.privacy)
    new_file.save()
    new_file.shared_among.set(parent.shared_among.all())
    new_file.present_in_shared_me_of.set(parent.present_in_shared_me_of.all())
    new_file.save()
    propagate_size_change(new_file.parent, new_file.size)
    return new_file


def get_presigned_url(key):
    s3 = boto3.client('s3')
    # Generate the URL to get 'key-name' from 'bucket-name'
    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': AWS_STORAGE_BUCKET_NAME,
            'Key': key
        },
        ExpiresIn=20
    )
    return url


def get_s3_filename(full_filename):
    filename, file_extension = os.path.splitext(full_filename)
    random_token = secrets.token_hex(4)
    s3_filename = f"{filename}__{random_token}{file_extension}"

    return s3_filename


def copy_s3(old_file_key, new_file_key):
    s3 = boto3.resource('s3')
    copy_source = {
        'Bucket': AWS_STORAGE_BUCKET_NAME,
        'Key': old_file_key
    }
    bucket = s3.Bucket(AWS_STORAGE_BUCKET_NAME)
    bucket.copy(copy_source, new_file_key)


def delete_s3(file_key):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(AWS_STORAGE_BUCKET_NAME)
    bucket.delete_objects(
        Delete={
            'Objects': [
                {
                    'Key': file_key
                },
            ],
        }
    )


def rename_s3(old_file_key, new_file_key):
    copy_s3(old_file_key, new_file_key)
    delete_s3(old_file_key)
