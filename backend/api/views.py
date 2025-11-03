from rest_framework import viewsets, generics, permissions
from .models import Card
from .serializers import CardSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated


class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the cards
        for the currently authenticated user.
        """
        user = self.request.user
        return Card.objects.filter(user=user)

    def perform_create(self, serializer):
        print("Hello world!")
        serializer.save(user=self.request.user)


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
