FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .htpasswd /etc/nginx/.htpasswd

COPY login.html /usr/share/nginx/html/login.html
COPY data.html /usr/share/nginx/html/data.html

EXPOSE 8198
CMD ["nginx", "-g", "daemon off;"]