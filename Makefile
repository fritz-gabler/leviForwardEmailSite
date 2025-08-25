up:
	docker compose -f ./docker/docker-compose.yml up

cclean:
	docker system prune -f
	docker rmi -f $$(docker images -qa) || true

stop:
	docker compose stop
