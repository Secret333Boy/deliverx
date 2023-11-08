FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build

FROM node:20-alpine as production
ENV NODE_ENV=production
ENV PORT=3001
WORKDIR /app
COPY package*.json .
RUN npm install --omit=dev
COPY --from=builder ./app/dist ./dist
EXPOSE 3001
CMD ["node", "./dist/main"]