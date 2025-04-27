from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.services.user_service import UserService

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_details(request):
    user = UserService.get_user_details(request.user)
    return Response(user, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    result = UserService.update_user_profile(request.user, request.data)
    if result.get("error"):
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    return Response(result, status=status.HTTP_200_OK)