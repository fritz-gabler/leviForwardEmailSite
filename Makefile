up:
	docker compose -f ./src/docker/docker-compose.yml up


cclean:
	docker system prune -f
	docker rmi -f $$(docker images -qa) || true

down:
	docker compose -f ./src/docker/docker-compose.yml down

re: down cclean up
