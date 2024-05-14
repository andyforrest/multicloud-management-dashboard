from typing import Union

from fastapi import FastAPI
from aws import get_buckets
import boto3

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/buckets/")
def read_buckets():
    s3 = boto3.client('s3')
    response = s3.list_buckets()
    buckets = get_buckets(response)
    return {"buckets": buckets}

