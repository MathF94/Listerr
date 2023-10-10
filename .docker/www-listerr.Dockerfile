FROM php:8.2-alpine

RUN docker-php-ext-install pdo_mysql

RUN mkdir -p /listerr/private

RUN ln -s /listerr/private/app/public /listerr/public

#RUN ln -s /listerr/private/api/public /listerr/public/api