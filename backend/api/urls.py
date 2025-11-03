from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CardViewSet, UserCreate


router = DefaultRouter()
router.register(r"cards", CardViewSet, basename="card")

urlpatterns = [
    path("register/", UserCreate.as_view(), name="user-register"),
    path("", include(router.urls)),
]
