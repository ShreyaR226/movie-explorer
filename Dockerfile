FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG NEXT_PUBLIC_TMDB_API_KEY 
ENV NEXT_PUBLIC_TMDB_API_KEY=$NEXT_PUBLIC_TMDB_API_KEY

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]

