FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN ["mkdir", "/etc/nginx/html"]
COPY index.html /etc/nginx/html/index.html
COPY server.js /etc/nginx/html/server.js

EXPOSE 8198
CMD ["nginx", "-g", "daemon off;"]