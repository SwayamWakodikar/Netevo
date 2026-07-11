FROM nginx:alpine

# Remove the default Nginx welcome page config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom configurations into the container
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/gateway.conf /etc/nginx/conf.d/gateway.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
