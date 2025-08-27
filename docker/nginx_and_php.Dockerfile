FROM php:8.1-fpm

RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Enable the SOAP extension
RUN docker-php-ext-install soap

COPY nginx.conf /etc/nginx/nginx.conf

# Copy the PHP configuration (if needed)
# COPY php.ini /usr/local/etc/php/

# Set the working directory
WORKDIR /var/www/html

# Expose the port
EXPOSE 80

# Start Nginx and PHP-FPM
CMD ["sh", "-c", "service php8.1-fpm start && nginx -g 'daemon off;'"]
