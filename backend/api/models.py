from django.db import models
from django.contrib.auth.models import User


class Card(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cards")
    nickname = models.CharField(max_length=100)
    card_benefits = models.TextField(max_length=350, null=True)
    card_image = models.ImageField(upload_to="card_images/", null=True, blank=True)
    last_used = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nickname
