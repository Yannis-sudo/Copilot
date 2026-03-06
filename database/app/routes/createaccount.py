from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models import User, create_user_table

router = APIRouter()


class CreateAccountRequest(BaseModel):
    email: str
    username: str
    password: str

@router.post("/create-account")
def create_account(request: CreateAccountRequest, db: Session = Depends(get_db)):
    new_user = User(username=request.username, email=request.email, password=request.password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": f"Account created for {request.username} with email {request.email}"}
    except IntegrityError:
        db.rollback()
        return {"message": "email already exists"}, 400