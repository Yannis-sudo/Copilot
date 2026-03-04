from fastapi import FastAPI
from app.routes import login, createaccount

app = FastAPI()

app.include_router(login.router, prefix="/api")
app.include_router(createaccount.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API is running!"}