from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserSchema(BaseModel):
    phone: str = Field(..., example="9876543210")
    name: Optional[str] = Field(None, example="John Doe")
    age: Optional[int] = Field(None, ge=0)
    gender: Optional[str] = Field(None, example="Male")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class DoctorSchema(BaseModel):
    name: str = Field(..., example="Dr. Jane Smith")
    email: Optional[str] = Field(None, example="doctor@example.com")    
    specialization: str = Field(..., example="Cardiology")
    experience_years: Optional[int] = Field(None, example=5)
    rating: Optional[int] = Field(0, example=5)
    is_verified: bool = Field(default=False)
    available_days: Optional[List[str]] = Field(default_factory=list)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
