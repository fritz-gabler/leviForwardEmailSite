up:
	docker compose -f ./docker/docker-compose.yml up

cclean:
	docker system prune -f
	docker rmi -f $$(docker images -qa) || true

down:
	docker compose -f ./docker/docker-compose.yml down
