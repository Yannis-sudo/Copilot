from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class CreateAccountRequest(BaseModel):
    email: str
    username: str
    password: str

@router.post("/create-account")
def create_account(request: CreateAccountRequest):
    # Here you would add logic to create the account, e.g. save to database
    # For now, we'll just return a success message
    return {"message": f"Account created for {request.username} with email {request.email}"}