#!/usr/bin/env python
import os
import sys

os.environ['PYTHONIOENCODING'] = 'utf-8'
os.environ['DJANGO_SETTINGS_MODULE'] = 'lenspirecrm.settings'

import django
django.setup()

from apps.users.models import User

# Create the user that matches the login form default
if not User.objects.filter(username='sandeepj').exists():
    User.objects.create_user('sandeepj', 'sandeep@lenspireai.com', 'Test@123', role='platform_owner')
    print("Created user: sandeepj with password: Test@123")
else:
    print("User sandeepj already exists")

# Create admin if missing
if not User.objects.filter(is_superuser=True, is_active=True).exists():
    User.objects.create_superuser('admin', 'admin@lenspireai.com', 'Admin@123')
    print("Created superuser: admin")
else:
    print("Superuser exists:", User.objects.get(is_superuser=True, is_active=True).username)
