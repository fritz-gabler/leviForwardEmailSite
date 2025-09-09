FROM debian:bullseye

# Install PHP-FPM and popular extensions in a single apt command
RUN apt update && apt install -y \
    php7.4-fpm \
    php7.4-mysql \
    php7.4-mbstring \
    php7.4-bcmath \
    php7.4-zip \
    php7.4-gd \
    php7.4-curl \
    php7.4-fpm \
    php7.4-soap \
    php7.4-xml

# Add any extra apt packages here (e.g. git, unzip, etc.)

RUN mkdir -p /var/www/html

COPY ./php-fpm/www.conf /etc/php/7.4/fpm/pool.d/www.conf
COPY ./php-fpm/php/index.php var/www/html/
COPY ./php-fpm/php/get_mail_accounts.php var/www/html/

RUN mkdir -p /run/php



CMD ["php-fpm7.4", "-F"]
