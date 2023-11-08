FROM node:20-alpine AS builder
WORKDIR /app
COPY ./public ./public
COPY ./src ./src
COPY ./package*.json .
COPY ./tsconfig.json .
RUN npm i --ignore-scripts
RUN npm run build
USER nonroot

FROM nginx:stable-alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]