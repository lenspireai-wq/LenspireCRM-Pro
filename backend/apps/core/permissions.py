from rest_framework import permissions


DEPARTMENTS = ("sales", "operations", "accounts", "production")
ACCESS_LEVELS = ("none", "read", "full")


def is_administrator(user):
    return bool(
        user
        and user.is_authenticated
        and (
            user.is_superuser
            or user.is_staff
            or str(getattr(user, "role", "")).strip().lower()
            == "administrator"
        )
    )


def department_level(user, department):
    if is_administrator(user):
        return "full"
    access = getattr(user, "department_access", None) or {}
    level = str(access.get(department, "none")).strip().lower()
    if level in ACCESS_LEVELS:
        return level
    return "none"


class AdminAccessPermission(permissions.BasePermission):
    message = "Administrator access is required."

    def has_permission(self, request, view):
        return is_administrator(request.user)


class PlatformOwnerPermission(permissions.BasePermission):
    message = "LenspireAI Platform Owner access is required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class DepartmentAccessPermission(permissions.BasePermission):
    department = ""
    message = "You do not have access to this department."

    def has_permission(self, request, view):
        level = department_level(request.user, self.department)
        if request.method in permissions.SAFE_METHODS:
            return level in {"read", "full"}
        return level == "full"


class SalesAccessPermission(DepartmentAccessPermission):
    department = "sales"


class OperationsAccessPermission(DepartmentAccessPermission):
    department = "operations"


class AccountsAccessPermission(DepartmentAccessPermission):
    department = "accounts"


class ProductionAccessPermission(DepartmentAccessPermission):
    department = "production"


class SharedBookingAccessPermission(permissions.BasePermission):
    """Customer and booking records support every operating department."""

    def has_permission(self, request, view):
        levels = [department_level(request.user, department) for department in DEPARTMENTS]
        if request.method in permissions.SAFE_METHODS:
            return any(level in {"read", "full"} for level in levels)
        return department_level(request.user, "sales") == "full"
