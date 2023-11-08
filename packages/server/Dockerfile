FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
COPY tsconfig*.json .
COPY ./src ./src
RUN npm i --ignore-scripts
RUN npm run build

FROM node:20-alpine AS production
ENV NODE_ENV=production
ENV PORT=3001
WORKDIR /app
COPY package*.json .
RUN npm install --omit=dev
COPY --from=builder ./app/dist ./dist
EXPOSE 3001
CMD ["node", "./dist/main"]