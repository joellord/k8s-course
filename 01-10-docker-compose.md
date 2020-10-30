# Lesson 10 - Using Docker Compose To Share An Entire Application

Now that you have everything stored in containers, you will want to share this entire three-tier application with the rest of your team. So far, you’ve been using the command line to start manually each one of the containers. This works on your local machine and you could even write some scripts to start and stop those containers, but there is an easier way.

This is where docker-compose will come into play. Docker-compose is part of the Docker tools suite and is an application that will take a YAML file to start all of your containers with one single command.  

The first thing you will need to do is to create a file called docker-compose.yaml at the root folder of your project. This is where you will define all the containers that are used by your application. In this file, you will start by telling docker-compose the version of the API to use. You can use 3.8 here. And then, you will define all the services and networks that are used by your application. 

```yaml
version: "3.8"
services: 
networks:
```

You can start by defining the database service. Before we start describing this service, you can look at the command that was used to start this container.

```bash
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql --network k8scourse mysql:5.7
```

You will want to add the same flags here as part of the docker-compose.yaml file. First, we will name this service "k8scourse-db". This is the same as the --name parameter that we used. Next, you will need to specify an image to use, in this case, it’s mysql:5.7.

```yaml
services:
  k8scourse-db:
    image: mysql:5.7
```

Now you can convert each parameter that was in your docker run command line. The -d flag can be omitted as this will be automatically done by docker-compose. For the ports, you will add the ports property which takes an array. In this case, you only have one port to map. Each port mapping is listed as a string. The environment variables are also listed as an array of keys and values listed under environment. We can ignore the --rm which will be taken care of by docker-compose. The mounted volume for the initial set of data can also be mounted here. Instead of using the current working directory as you did previously, you can use a path relative to the docker-compose file. And finally, you will need to specify the network in which this container will be running.

```yaml
  k8scourse-db:
    image: mysql:5.7
    ports: 
      - "3306:3306"
    environment:
      - MYSQL_USER=user
      - MYSQL_PASSWORD=mysql
      - MYSQL_ROOT_PASSWORD=root
    volumes:
      - "./db/init.sql:/docker-entrypoint-initdb.d/init.sql"
    networks:
      - k8scourse
```

Now that you’ve defined the database server, you can define the back-end as well. Once again, you can start from the docker run command you used before.

```bash
docker run -p 3001:3000 --name k8scourse-back --rm --network k8scourse -e MYSQL_HOST=k8scourse-db -d k8scourse-back
```

For this service, we will name it k8scourse-back and it will use the image called <username>/k8scourse-back:1. Note that we used the version number here. This way, if someone tried to run this docker-compose file, it will pull the version you specified in this file. Once again, you can ignore the --rm and -d flags. The ports will be mapped on 3000 in your local machine to the port 3000 inside the container. This service will be using the k8scourse network. And finally, you will need to specify the name of the database service in an environment variable.

```yaml
  back:
    image: joellord/k8scourse-back:1
    ports:
      - "3000:3000"
    networks:
      - k8scourse
    environment:
      - MYSQL_HOST=k8scourse-db
```

You can do the same for the front-end. Starting with the docker run command line you used earlier.

```bash
docker run -p 8080:8080 --name k8scourse-front --rm -e BASE_URL=http://localhost:3001 -d k8scourse-front
```

You will create a new service called k8scourse-front that will use the <username>/k8scourse-front:1 image. You can map the ports 8080 to 8080 and specify the BASE_URL environment variable.

```yaml
  k8scourse-front:
    image: joellord/k8scourse-front:1
    ports:
      - "8080:8080"
    environment:
      - BASE_URL=http://localhost:3000
```

Finally, you will need to specify the networks to be used in this file. In the networks section, you can list the only network that will be used. This network will use the default parameters, hence the empty colon at the end.

```yaml
networks:
  k8scourse:
```

Your final docker-compose.yaml file should look like this.

```yaml
version: "3.8"
services:
  k8scourse-db:
    image: mysql:5.7
    ports:
      - "3306:3306"
    environment:
      - MYSQL_USER=user
      - MYSQL_PASSWORD=mysql
      - MYSQL_ROOT_PASSWORD=root
    volumes:
      - "./db/init.sql:/docker-entrypoint-initdb.d/init.sql"
    networks:
      - k8scourse
  k8scourse-back:
    image: joellord/k8scourse-back:1
    ports:
      - "3000:3000"
    environment:
      - MYSQL_HOST=k8scourse-db
    networks:
      - k8scourse
  k8scourse-front:
    image: joellord/k8scourse-front:1
    ports:
      - "8080:8080"
    environment:
      - BASE_URL=http://localhost:3000
networks:
  k8scourse:
```

Now that your docker-compose.yaml file is completed, docker-compose will be able to use this to start all the necessary containers and run your application. From the root folder, run docker-compose up to start all the services at once. You will see the logs in real-time of each one of your services. Just like when you ran a docker run command, you can use the -d flag to run all the services in detached mode.

```bash
docker-compose up
```

To stop the services, you can use Ctrl-C if running with the logs opened or with docker-compose down if you are running everything in detached mode

```bash
docker-compose up -d
docker-compose down
```

You can now send this docker-compose.yaml file and send it to another laptop that has Docker installed. From this other machine, you can run the docker-compose up command and docker will automatically download all the required images and start all of your services. It doesn’t matter how the other laptop is configured if it has NodeJs installed or MySQL. It doesn’t matter which operating system it is using. The application will always run the same in any environment.

So far, we’ve focused mainly on how to use containers in a development environment. You now know how to use containers and even how to build your own if needed. You’ve also seen how useful they can be and how easy it can be to share multiple services with your colleagues. This sums up the first part of this course. In the next part, you will learn how to deploy those containers in a Kubernetes cluster.

