from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Card(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cards")
    nickname = models.CharField(max_length=100)
    card_benefits = models.TextField(max_length=350, null=True)
    card_image = models.ImageField(upload_to="card_images/", null=True, blank=True)
    last_used = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nickname


class UserProfile(models.Model):
    """
    This model extends the default User model to add extra
    profile information
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    last_application_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
