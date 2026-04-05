from pydantic import BaseModel

class InputData(BaseModel):
    age: int
    gender: int
    education: int
    ses: int
    cognitive_score: int