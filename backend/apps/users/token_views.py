from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView

from .authentication import ensure_studio_is_active
from .models import User


class OrganizationAwareTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = self.token_class(attrs["refresh"])
        user_id = refresh.get("user_id")
        try:
            user = User.objects.select_related("organization").get(pk=user_id)
        except User.DoesNotExist as error:
            raise AuthenticationFailed("Account is no longer available.") from error
        if not user.is_active:
            raise AuthenticationFailed("Account is inactive.")
        ensure_studio_is_active(user)
        return super().validate(attrs)


class OrganizationAwareTokenRefreshView(TokenRefreshView):
    serializer_class = OrganizationAwareTokenRefreshSerializer
