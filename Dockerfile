FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm install -g serve

RUN npm run build



EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]