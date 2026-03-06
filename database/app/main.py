from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import login, createaccount

app = FastAPI()

origins = [
    "http://localhost:5173",   # React dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # Only trusted frontends
    allow_credentials=True,
    allow_methods=["*"],       # GET, POST, PUT, DELETE
    allow_headers=["*"],       # Content-Type, Authorization, etc.
)

app.include_router(login.router, prefix="/api")
app.include_router(createaccount.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API is running!"}