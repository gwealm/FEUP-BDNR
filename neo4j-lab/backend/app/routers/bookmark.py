from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from ..dependencies import db
from datetime import datetime
import hashlib

router = APIRouter()



class Bookmark(BaseModel):
    url: str
    tags: str


@router.post("/bookmark/")
async def create_bookmark(bookmark: Bookmark):
    timestamp = datetime.now()
    url_md5 = hashlib.md5(bookmark.url.encode("utf-8")).hexdigest()

    tag_list = [tag.strip() for tag in bookmark.tags.split(',')]

    db.insert_bookmark(url_md5, bookmark.url, timestamp, set(tag_list))


@router.get("/bookmark/")
async def get_latest_bookmarks():
    return list(db.get_latest_bookmarks(15))


@router.get("/bookmark/{url_md5}")
async def get_bookmark(url_md5: str):
    bookmark = db.get_bookmark_by_url_hash(url_md5)

    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    return bookmark[0]


@router.get("/bookmark/tag/")
async def get_bookmarks_by_tags(tags: str):

    uniq_tags = list(set(tags.split(',')))
    bookmarks = db.get_bookmarks_by_tag(uniq_tags)
    
    return bookmarks
