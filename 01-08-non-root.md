# Lesson 8 - Creating non-root images

So far, you’ve managed to get all of your containers running on your local machine. That is great for your development environment and you are almost ready to start sharing those images with your team and to deploy them on a server.

While the risks are very limited in your own environment, you will need to have security in mind when you are deploying those containers to a production server. Some hosts will prevent any container where the user is root to be running at all. 

The containers you built in the previous lessons are running as root for a few reasons. First of all, we read and write files from the file system in order to install tools like jq or to change some configuration files. And second, we are running servers on ports that are restricted to the root user (such as port 80).  

You can start by modifying the Dockerfile for the back-end service. Because we are using a node base image, there is a non-root user available for us to use. This user is called node and is part of the node group. In the current iteration of your Dockerfile, you start with the node base image and then switch to a working directory named /app. Docker will create that directory if it doesn’t exist and the owner of that directory will be root. In order to give the necessary permissions to user node, you can add a command to manually create this folder and then change the ownership to node. Once the directory is created and the working directory has been changed, you can tell Docker to switch to the node user for the rest of the commands that are executed in the Dockerfile.

```docker
FROM node:14
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
USER node
```

All the subsequent commands will be running as a non-root user called node. The last change that you will need to do is to the COPY commands. You will need to ensure that the ownership of the files that you copy from your file system into the container is actually to the node user. You can do this by adding a --chown flag to the COPY commands.

```docker
COPY --chown=node:node *.js /app/
COPY --chown=node:node assets/* /app/assets/
COPY --chown=node:node tmp /app/
```

Your final back/Dockerfile should look like this.

```docker
# Dockerfile
FROM node:14
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
USER node
RUN mkdir tmp
RUN mkdir assets
COPY ./package*.json /app/
RUN npm install
COPY --chown=node:node *.js /app/
COPY --chown=node:node assets/* /app/assets/
COPY --chown=node:node tmp /app/
CMD ["node", "/app"]
```

The image for your back end is now completed. It now has everything necessary to run in any environment and it is now more secure as it runs as a non-root user. The code in it will also rely on environment variables to specify things such as the API keys or the database host, username and password.

It’s now time to tackle the front-end container. This container uses two steps. The first step uses a container to build the production version of your VueJs application. This container won’t be deployed on a server, its purpose is to create the necessary files for the second step. This Nginx server is the one that will need to run as a non-root user. To do so, you will first need to change the Nginx configuration.

First, you will need the basic required configuration parameters for an Nginx configuration file. You can create a new file in the /front folder named nginx.conf. 

```bash
# front/nginx.conf
worker_processes auto;
events {
  worker_connections 1024;
}
http {
  include /etc/nginx/mime.types;
  server {
    server_name _;
    index index.html;
    location / {
      try_files $uri /index.html;
      }
    }
}
```

Next, you will need to change the server settings to run on port 8080 instead of the default port 80, which is restricted to the root user. And you can also change the default path that Nginx will use to serve files from. You will then change your Dockerfile to use this folder instead and you will change the ownership of that folder so that our non-root user can use it.

```bash
http {
  ...
  server {
    listen 8080;
    ...
    location / {
      root /code;
      ...
    }
  }
}
```

Your final nginx.conf file should look like this.

```bash
# front/nginx.conf
worker_processes auto;
events {
  worker_connections 1024;
}
http {
  include /etc/nginx/mime.types;
  server {
    listen 8080;
    server_name _;
    index index.html;
    location / {
      root /code;
      try_files $uri /index.html;
    }
  }
}
```

Now that you have a new Nginx configuration file that will let the server run as a regular user, it’s time for you to edit your Dockerfile one last time. This modified container will run as user nginx. In this case, the Nginx base images provide us with this non-root user. In many cases, you will see user 1000 being used. This is an arbitrary number, you could use just about anything or even create a user with a useradd command. Using user 1000 is a standard way to do this in docker when a non-root user is not provided.

In the second step of your build, right after you’ve specified your base image with the FROM statement, you can COPY your new Nginx configuration file to overwrite the default one. Then, similar to what you did for your front-end, you can create a /code folder and change the ownership of it. 

```docker
FROM nginx:1.17
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /code && chown -R nginx:nginx /code && chmod -R 755 /code
```

Next, there is a series of files and folders that Nginx needs access to in order to run. Those files are used for caching and logging. These folders are /var/cache/nginx, /var/log/nginx and /etc/nginx/conf.d. You can change the ownership of all these commands in a single RUN statement using ampersands to chain those commands.

```docker
RUN chown -R nginx:nginx /var/cache/nginx && \
   chown -R nginx:nginx /var/log/nginx && \
   chown -R nginx:nginx /etc/nginx/conf.d
```

Nginx also requires an nginx.pid file. This file does not exist yet so you need to create it and to assign the ownership to the nginx user.

```docker
RUN touch /var/run/nginx.pid && \
   chown -R nginx:nginx /var/run/nginx.pid  
```

Finally, you will need to change the group for those files and folders as well as change the permissions so that Nginx can read and write these folders.

```docker
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid && \
   chmod -R 755 /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid
```

As you are changing all permissions in the file system, you can move the lines in your original Dockerfile that copied the start_nginx.sh script right in this section.

```docker
COPY start_nginx.sh /
RUN chmod +x /start_nginx.sh
```

Now that all the permissions have been adjusted, you can tell docker to switch over to the nginx user using the USER statement.  You can then copy the files from the builder step into the /code folder you created earlier. Be sure to add the --chown flag to the copy statement so that the files will be writable by the nginx user. Finally, you will need to tell Docker that this new image uses a different port. To do this, you will use the EXPOSE statement for port 8080 as this is what you specified in the Nginx configuration file. This is done just before you start the server with the ENTRYPOINT command.

```docker
USER nginx
COPY --from=builder --chown=nginx /app/dist /code
EXPOSE 8080
```

Your final front/Dockerfile will look like this

```docker
# front/Dockerfile
FROM node:14 AS builder
COPY . /app
WORKDIR /app
ENV JQ_VERSION=1.5
RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq
WORKDIR /app/src
RUN contents="$(jq '.BASE_URL = "$BASE_URL"' config.json)" && echo ${contents} > config.json
WORKDIR /app
RUN npm install
RUN npm run build
FROM nginx:1.17
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /code && chown -R nginx:nginx /code && chmod -R 755 /code
RUN chown -R nginx:nginx /var/cache/nginx && \
   chown -R nginx:nginx /var/log/nginx && \
   chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
   chown -R nginx:nginx /var/run/nginx.pid
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid && \
   chmod -R 755 /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid  
COPY start_nginx.sh /
RUN chmod +x /start_nginx.sh
USER nginx
WORKDIR /code
COPY --from=builder --chown=nginx /app/dist .
EXPOSE 8080
ENTRYPOINT ["/start_nginx.sh"]
```

Before you rebuild this container, you will also need to change your start_nginx.sh script. The current script is looking for JavaScript files to edit in the /usr/share/nginx/html folder but our code is now in the /code folder. You will need to change the first line of your script to search for files in the correct folder.

```bash
#!/usr/bin/env bash
for file in /code/js/app.*.js;
do
 if [ ! -f $file.tmp.js ]; then
   cp $file $file.tmp.js
 fi
 envsubst '$BASE_URL' < $file.tmp.js > $file
done
nginx -g 'daemon off;'
```

You are now ready to rebuild those two containers and start everything again. From the front folder, run a docker build. Then switch to the back folder and run a docker build here too. Finally, back to the root folder, you can restart all of your containers. When starting your new front end container, don’t forget that you will now need to map to port 8080 instead of the port 80 as you did previously.

```bash
docker build -t k8scourse-front .
cd ../back
docker build -t k8scourse-back .
cd ../db
docker stop k8scourse-db
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql --network k8scourse mysql:5.7
docker stop front
docker run -p 8080:8080 --name front --rm -e BASE_URL=http://localhost:3001 -d k8scourse-front
docker stop back
docker run -p 3001:3000 --name back --rm --network k8scourse -e MYSQL_HOST=k8scourse-db -d k8scourse-back
```

Once again, you can now point your browser to [http://localhost:8080](http://localhost:8080) and everything will be running again. But this time, everything is running as regular users making it more secure. Furthermore, this will make it easier for you to deploy on various servers as some of them would’ve blocked your containers running as root.

Now that you have everything containerized, you will need to share these containers with the rest of the world, and this is what you will do in the next lesson.
