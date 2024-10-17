FROM node:20 as base
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

FROM gcr.io/distroless/nodejs20-debian12
COPY --from=base /app /app
WORKDIR /app
EXPOSE 4080
CMD [ "src/index.js" ]