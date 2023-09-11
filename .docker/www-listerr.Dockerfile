FROM php:8.2-alpine

RUN docker-php-ext-install pdo_mysql

RUN mkdir -p /listerr/app/public
RUN mkdir -p /listerr/app/private

RUN ln -s /listerr/app/private/app/public/.htaccess /listerr/app/public/.htaccess
RUN ln -s /listerr/app/private/app/public/css /listerr/app/public/css
RUN ln -s /listerr/app/private/app/public/js /listerr/app/public/js
RUN ln -s /listerr/app/private/app/public/img /listerr/app/public/img
RUN ln -s /listerr/app/private/app/public/fonts /listerr/app/public/fonts
RUN ln -s /listerr/app/private/app/public/index.html /listerr/app/public/index.html
RUN ln -s /listerr/app/private/app/public/manifest.json /listerr/app/public/manifest.json
RUN ln -s /listerr/app/private/api/public /listerr/app/public/api
