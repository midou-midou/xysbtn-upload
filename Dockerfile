FROM  node:20.11.1-alpine3.19
LABEL maintainer="midoude163@163.com"
LABEL name="xysbtn-upload"

ENV EXPOSE_PORT 3000
WORKDIR /app
COPY . .
RUN yarn global add pm2
RUN yarn install

EXPOSE ${EXPOSE_PORT}
ENTRYPOINT [ "yarn", "prod" ]