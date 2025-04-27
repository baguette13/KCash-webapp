from api.repositories.user_repository import UserRepository
from api.serializers import UserSerializer

class UserService:
    @staticmethod
    def get_user_details(user):
        serializer = UserSerializer(user)
        return serializer.data

    @staticmethod
    def update_user_profile(user, data):
        # Walidacja danych wejściowych
        serializer = UserSerializer(instance=user, data=data, partial=True)
        if serializer.is_valid():
            updated_user = UserRepository.update_user(user, serializer.validated_data)
            return UserSerializer(updated_user).data
        return {"error": serializer.errors}