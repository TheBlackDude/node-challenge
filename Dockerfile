# TODO: write a Dockerfile for the API
FROM node:carbon-slim

####################################################################
## install app
## copy files one by one and split commands to use docker cache 
####################################################################

WORKDIR /code

COPY package.json /code/package.json
RUN yarn install --loglevel silent

ENV PATH /code/node_modules/.bin:$PATH

COPY ./ /code

