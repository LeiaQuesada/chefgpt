from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """
    By creating our own base model
    we can add the from_attributes config
    which allows us to to use model_validate on any
    of our pydantic models
    """

    model_config = ConfigDict(from_attributes=True)
