from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone


PAUSED_MESSAGE = "This studio workspace is paused. Contact the LenspireAI Platform Owner."
EXPIRED_MESSAGE = "This studio subscription has expired. Contact the LenspireAI Platform Owner."


def ensure_studio_is_active(user):
    if user.is_superuser:
        return
    organization = getattr(user, "organization", None)
    if organization and not organization.active:
        raise AuthenticationFailed(PAUSED_MESSAGE)
    if (
        organization
        and organization.subscription_expires_at
        and organization.subscription_expires_at < timezone.localdate()
    ):
        raise AuthenticationFailed(EXPIRED_MESSAGE)


class OrganizationAwareJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        ensure_studio_is_active(user)
        return user
