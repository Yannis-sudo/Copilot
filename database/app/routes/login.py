from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    # Here you would add logic to authenticate the user, e.g. check credentials against database
    # For now, we'll just return a success message
    return {"message": f"User logged in with email {request.email}"}