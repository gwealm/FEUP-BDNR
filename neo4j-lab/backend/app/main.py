from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import bookmark

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(bookmark.router)

@app.get("/")
async def root():
    return {"message": "This is the BookIT app!"}