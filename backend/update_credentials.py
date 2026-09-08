#!/usr/bin/env python
import os
import sys

os.environ['PYTHONIOENCODING'] = 'utf-8'
os.environ['DJANGO_SETTINGS_MODULE'] = 'lenspirecrm.settings'

import django
django.setup()

from apps.users.models import User

# Update sandeepj password
if User.objects.filter(username='sandeepj').exists():
    user = User.objects.get(username='sandeepj')
    user.set_password('admin123')
    user.save()
    print(f"Updated password for user: {user.username}")
else:
    User.objects.create_user('sandeepj', 'sandeep@lenspireai.com', 'admin123', role='platform_owner')
    print(f"Created user: sandeepj with password: admin123")