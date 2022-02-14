FROM node:12-alpine

EXPOSE 8080
ENV HOST 0.0.0.0

# コマンド実行
RUN apk update && \
  apk add git && \
  npm install -g @vue/cli nuxt create-nuxt-app
