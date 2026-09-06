# Hostinger VPS Deployment Guide

## Prerequisites

- Ubuntu 22.04+ VPS with root access
- Domain `crm.lenspireai.com` pointing to VPS IP
- Hostinger subdomain/document root for PHP gateway

## 1. VPS Initial Setup

```bash
# Update system
apt update && apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
apt install -y docker-compose-plugin
```

## 2. Install PostgreSQL

Option A — VPS local PostgreSQL:
```bash
apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE DATABASE lenspirecrm;"
sudo -u postgres psql -c "CREATE USER lenspirecrm WITH PASSWORD 'your-secure-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE lenspirecrm TO lenspirecrm;"
systemctl enable --now postgresql
```

Option B — Hostinger Managed DB:
- Create a PostgreSQL database in Hostinger control panel
- Note the host, port, username, password, and database name
- Ensure the VPS IP is whitelisted in Hostinger's firewall

## 3. Deploy Application

```bash
# Clone repo
git clone https://github.com/lenspireai-wq/LenspireCRM-Pro.git /opt/lenspirecrm
cd /opt/lenspirecrm

# Copy and edit production environment
cp backend/.env.production.example backend/.env
nano backend/.env
```

Required values in `backend/.env`:
- `SECRET_KEY` — strong random string
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`
- `BACKUP_ENCRYPTION_KEY` — 32-character random string
- `ALLOWED_HOSTS` — include `crm.lenspireai.com` and VPS IP
- `CORS_ALLOWED_ORIGINS` — `https://crm.lenspireai.com`

## 4. Start Services

```bash
# Run migrations and start
docker compose -f docker-compose.hostinger.yml pull
docker compose -f docker-compose.hostinger.yml build
docker compose -f docker-compose.hostinger.yml run --rm api python manage.py migrate --noinput
docker compose -f docker-compose.hostinger.yml run --rm api python manage.py migrate_from_worker --noinput
docker compose -f docker-compose.hostinger.yml run --rm api python manage.py collectstatic --noinput
docker compose -f docker-compose.hostinger.yml up -d
```

## 5. Configure Hostinger Gateway

Upload `hostinger-gateway/index.php` and `hostinger-gateway/.htaccess` to your Hostinger subdomain document root for `crm.lenspireai.com`.

Set environment variables in Hostinger:
- `LENSPIRE_WEB_UPSTREAM=http://<vps-ip>:8080`
- `LENSPIRE_API_UPSTREAM=http://<vps-ip>:8000`

## 6. Verify

```bash
# Check containers
docker compose -f docker-compose.hostinger.yml ps

# Check API health
curl http://<vps-ip>:8000/api/

# Check web UI
curl http://<vps-ip>:8080
```

## 7. Production Hardening

Once verified:
- Set `SECURE_SSL_REDIRECT=true` in `backend/.env`
- Ensure HTTPS is active on `crm.lenspireai.com`
- Configure firewall: `ufw allow 80,443/tcp` (close 8080/8000 from public if behind gateway)
- Set up regular PostgreSQL backups
- Configure log rotation for Docker containers

## Updating

```bash
cd /opt/lenspirecrm
git fetch origin
git reset --hard origin/main
docker compose -f docker-compose.hostinger.yml pull
docker compose -f docker-compose.hostinger.yml build
docker compose -f docker-compose.hostinger.yml up -d --force-recreate
```
