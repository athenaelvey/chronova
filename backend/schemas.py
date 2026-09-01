from typing import Optional
from pydantic import BaseModel
from pydantic import model_validator
from typing import Literal
from typing import Any
from typing import List

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

field_types = {
    "PSRJ": "string",
    "TYPE": "string",
    "classification": "categorical",
    "P0": "numeric",
    "P1": "numeric",
    "DIST": "numeric",
}

valid_operators = {
    "numeric": [">", "<", "=", ">=", "<="],
    "string": ["contains", "="],
    "categorical": ["="],
}

class Condition(BaseModel):
    field : Literal["classification", "P0", "P1", "PSRJ", "TYPE", "DIST"]
    operator : Literal["<", ">", "=", "<=", ">=", "contains"]
    value : Any

    @model_validator(mode="after")
    def check_operator_matches_field_type(self):
        field_type = field_types[self.field]
        allowed_ops = valid_operators[field_type]

        if self.operator not in allowed_ops:
            raise ValueError(
                f"Operator '{self.operator}' is not valid for field '{self.field}' (type: {field_type}). "
                f"Allowed operators: {allowed_ops}"
            )
        return self

class FilterRequest(BaseModel):
    conditions: List[Condition]
    combinator: Literal["AND", "OR"]