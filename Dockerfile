FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm i @vitejs/plugin-react

RUN npm i 

RUN npm install -g serve

RUN npm run build



EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]