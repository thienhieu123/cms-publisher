FROM node:18-alpine as build-stage
WORKDIR /source
# COPY ./ .
# RUN npm install && npm run build
COPY ["[^src]*", "."]
RUN npm install
COPY ./ .
RUN npm run build-uat

# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /source/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]