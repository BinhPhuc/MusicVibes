FROM node:18-alpine AS build-stage

WORKDIR /app

COPY . .
COPY package*.json ./

RUN npm install --frozen-lockfile
RUN npm install -g @angular/cli
# RUN --omit=dev

RUN npm run build --prod

CMD ["npm", "start"]

# FROM nginx:latest AS production-stage

# COPY --from=build-stage /app/dist /usr/share/nginx/html

# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
