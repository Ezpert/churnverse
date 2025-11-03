# api/management/commands/send_card_alerts.py

import datetime
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.utils import timezone

# This is the updated import to match your model.
# Assuming your app is named 'api'. If not, change 'api' to your app's name.
from api.models import Card


class Command(BaseCommand):
    """
    A Django management command to send email alerts for inactive credit cards.

    This command iterates through all users and their cards, checks for inactivity
    based on the 'last_used' date, and sends a summary email to users with cards
    that have crossed a defined threshold.

    To run this command:
    python manage.py send_card_alerts
    """

    help = "Sends email alerts for credit cards that have been inactive for a defined period."

    def handle(self, *args, **options):
        # --- Configuration ---
        # Define the inactivity thresholds in days. These are easy to change.
        YELLOW_THRESHOLD_DAYS = 90
        RED_THRESHOLD_DAYS = 180

        today = timezone.now().date()

        self.stdout.write(
            self.style.SUCCESS(f"Starting card inactivity check for {today}...")
        )

        alerts_sent = 0

        # --- Main Logic ---
        # 1. Get all users in the system.
        users = User.objects.all()

        for user in users:
            yellow_cards = []
            red_cards = []

            # 2. Get all cards for the current user.
            # Using your model name 'Card'.
            user_cards = Card.objects.filter(user=user)

            for card in user_cards:
                # 3. Check if the 'last_used' date exists.
                if card.last_used:
                    # 4. Calculate inactivity based on the 'last_used' field.
                    inactivity_days = (today - card.last_used).days

                    # 5. Check if the card has crossed a threshold.
                    # We check for equality (==) to send the alert only ONCE.
                    if inactivity_days >= RED_THRESHOLD_DAYS:
                        red_cards.append(card)
                    elif inactivity_days == YELLOW_THRESHOLD_DAYS:
                        yellow_cards.append(card)

            # 6. If any inactive cards were found, compose and send one email.
            if yellow_cards or red_cards:
                subject = "ChurnVerse: Credit Card Inactivity Alert!"
                message_body = [
                    f"Hi {user.username},\n\nThis is an automated alert from ChurnVerse. Some of your cards require attention:\n"
                ]

                if yellow_cards:
                    message_body.append(
                        f"\n--- Approaching Inactivity ({YELLOW_THRESHOLD_DAYS} days) ---\n"
                    )
                    for card in yellow_cards:
                        # Using your field names: 'nickname' and 'last_used'
                        message_body.append(
                            f"- {card.nickname} (Last used: {card.last_used.strftime('%Y-%m-%d')})\n"
                        )

                if red_cards:
                    message_body.append(
                        f"\n--- CRITICAL: Inactive ({RED_THRESHOLD_DAYS} days) ---\n"
                    )
                    for card in red_cards:
                        # Using your field names: 'nickname' and 'last_used'
                        message_body.append(
                            f"- {card.nickname} (Last used: {card.last_used.strftime('%Y-%m-%d')})\n"
                        )

                message_body.append(
                    "\nPlease log in to your ChurnVerse dashboard to ping your cards.\n\n- The ChurnVerse Team"
                )

                final_message = "".join(message_body)

                # Send the email.
                send_mail(
                    subject=subject,
                    message=final_message,
                    from_email="alerts@churnverse.com",  # Your verified sender email
                    recipient_list=[user.email],
                    fail_silently=False,
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Successfully sent alert to {user.email} for {len(yellow_cards) + len(red_cards)} card(s)."
                    )
                )
                alerts_sent += 1

        if alerts_sent == 0:
            self.stdout.write(
                self.style.SUCCESS("No inactive cards found today. All clear!")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f"\nFinished. Sent a total of {alerts_sent} alerts.")
            )
