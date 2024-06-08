FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM nginx:stable-alpine as runner
WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
ENV PORT 80
EXPOSE $PORT
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'