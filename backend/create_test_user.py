import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lenspirecrm.settings')
django.setup()

from apps.users.models import User

# Check existing users
users = User.objects.filter(is_active=True)
print(f"Found {users.count()} active users:")
for u in users[:5]:
    print(f"  - {u.username} ({u.email}) role={u.role}")

# Create test user if none exist
if not users.exists():
    print("\nCreating test user...")
    user = User.objects.create_user('testuser', 'test@lenspireai.com', 'Test@123', role='platform_owner')
    print(f"Created: {user.username} ({user.email})")
