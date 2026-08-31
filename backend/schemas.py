from typing import Optional
from pydantic import BaseModel

class PulsarOut(BaseModel):
    id: int
    classification : str
    P0_ERR: Optional[float] = None
    P1 : Optional[float] = None
    P1_ERR: Optional[float] = None
    DIST : Optional[float] = None
    P0 : float
    PSRJ : str 
    TYPE: Optional[str] = None

    class Config: 
        from_attributes = True