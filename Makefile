up:
	@if [ ! -f /var/local/data/leviForwardEmailSite/express-server/package.json ]; then \
		cp ./src/app/package.json /var/local/data/leviForwardEmailSite/express-server/; \
	fi
	@if [ ! -f /var/local/data/leviForwardEmailSite/express-server/www.conf ]; then \
		cp -R ./src/php-fpm/* /var/local/data/leviForwardEmailSite/php-fpm-and-nginx/.; \
	fi
	@docker compose -f ./src/docker/docker-compose.yml up

cclean:
	@docker system prune -f > /dev/null
	@docker rmi -f $$(docker images -qa) > /dev/null 2>&1 || true
	@rm -rf /var/local/data/leviForwardEmailSite/express-server/*
	@rm -rf /var/local/data/leviForwardEmailSite/php-fpm-and-nginx/*
	@printf "\e[32m✔\e[0m used prune docker\n\e[32m✔\e[0m removed docker images\n\e[32m✔\e[0m rm files in volumes\n"

down:
	docker compose -f ./src/docker/docker-compose.yml down

re: down cclean up
