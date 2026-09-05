from celery import shared_task

@shared_task
def create_scheduled_backup():
    from .utils import create_backup_file
    return str(create_backup_file())

