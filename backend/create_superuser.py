#!/usr/bin/env python
import os
import django

# Configure environment to avoid Unicode issues
os.environ['PYTHONIOENCODING'] = 'utf-8'
os.environ['LC_ALL'] = 'en_US.UTF-8'
os.environ['LANG'] = 'en_US.UTF-8'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lenspirecrm.settings')

# Setup Django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    import sys
    try:
        execute_from_command_line(sys.argv)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
