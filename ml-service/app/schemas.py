from pydantic import BaseModel

class FocusScoreRequest(BaseModel):
    study_duration_minutes: int
    breaks_taken: int
    subject_type: int
    time_of_day: int
    self_rating: int
    sleep_hours: float
    distractions: int