# generate certificate
bash ./scripts/nginx/init-letsencrypt.sh & \


DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose build & \
docker-compose exec backend yarn migrate:js & \
docker-compose up -d --force-recreate