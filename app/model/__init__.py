# from app.model.user_model import User  # Register the User model

# from app.model.user_model import User
# from app.model.consultant_profile_model import ConsultantProfile

from .user_model import User  # Plus other models if needed
from app.model.models import  Assessment, Attendance  # Consolidated models
from .models import LearningProgress  # Only if keeping this separate
__all__ = [
    'User',
    'Assessment',
    'Attendance', 
    'LearningProgress'  # Only if keeping separate
]
