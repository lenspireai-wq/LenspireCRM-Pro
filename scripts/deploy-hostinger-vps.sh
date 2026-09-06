#!/usr/bin/env bash
set -euo pipefail

# LenspireCRM Pro — Hostinger VPS deployment helper
# Run this on the VPS after installing Docker and Docker Compose.

REPO_DIR="/opt/lenspirecrm"
COMPOSE_FILE="docker-compose.hostinger.yml"

echo "=== LenspireCRM Pro VPS Deployment ==="

if [ ! -d "$REPO_DIR" ]; then
  echo "Cloning repository..."
  git clone https://github.com/lenspireai-wq/LenspireCRM-Pro.git "$REPO_DIR"
else
  echo "Repository already exists, pulling latest..."
  cd "$REPO_DIR"
  git fetch origin
  git reset --hard origin/main
fi

cd "$REPO_DIR"

if [ ! -f "backend/.env" ]; then
  echo "Creating backend/.env from production example..."
  cp backend/.env.production.example backend/.env
  echo ""
  echo "IMPORTANT: Edit backend/.env with your production values:"
  echo "  - SECRET_KEY"
  echo "  - POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST"
  echo "  - BACKUP_ENCRYPTION_KEY"
  echo "  - ALLOWED_HOSTS"
  echo ""
  read -p "Press Enter after editing backend/.env..."
fi

echo "Pulling and building containers..."
docker compose -f "$COMPOSE_FILE" pull
docker compose -f "$COMPOSE_FILE" build

echo "Running database migrations..."
docker compose -f "$COMPOSE_FILE" run --rm api python manage.py migrate --noinput
docker compose -f "$COMPOSE_FILE" run --rm api python manage.py migrate_from_worker --noinput
docker compose -f "$COMPOSE_FILE" run --rm api python manage.py collectstatic --noinput

echo "Starting services..."
docker compose -f "$COMPOSE_FILE" up -d

echo "Waiting for services to be healthy..."
sleep 10

echo "=== Deployment complete ==="
echo "Web UI:  http://<vps-ip>:8080"
echo "API:     http://<vps-ip>:8000/api"
echo ""
echo "Next steps:"
echo "1. Point crm.lenspireai.com to this VPS IP"
echo "2. Deploy hostinger-gateway/ to Hostinger subdomain document root"
echo "3. Set LENSPIRE_WEB_UPSTREAM and LENSPIRE_API_UPSTREAM in Hostinger"
echo "4. Run: docker compose -f $COMPOSE_FILE ps  (verify all services are up)"
