#Adapted from https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html

#Setup node and build project
FROM node:lts-alpine
WORKDIR /sjakk-arena-front
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# Start project and expose port 80 with nginx
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
