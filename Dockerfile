FROM  node:20.11.1-alpine3.19
LABEL maintainer="midoude163@163.com"
LABEL name="xysbtn-upload"

ENV EXPOSE_PORT 3000
WORKDIR /app
COPY . .
RUN yarn install
RUN mkdir -p voices uploadTmp

EXPOSE ${EXPOSE_PORT}
ENTRYPOINT [ "yarn", "prod" ]