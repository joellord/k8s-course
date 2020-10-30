# Lesson 5 - Networking in Docker

In the last lesson, our backend stopped working again because it couldn’t find the database. That’s might seem out, especially since we fixed a similar issue in a previous lesson. 

One of the advantages of running containers is that they run in isolation. As far as the container is concerned, nothing exists outside of it. It behaves as if it was its own operating system. This is why the backend can’t find the database on "localhost". The two containers are running on the same host but as far as the backend is concerned, there is no database. The same goes for the database. It can’t see anything outside of what is running in its container therefore it can’t see the backend application running.

This is great for many reasons. First of all, it prevents your containers to access the host operating system. If something happens inside the container and crashes it, you can simply restart it, nothing can happen to the host machine. It also helps to prevent unwanted communication between various containers that might be running on your host. You might have multiple databases running but you won’t want all of your applications to have access to all those databases. Containers will prevent this.

Yet, sometimes you want your containers to be able to speak to each other. This is where container networks can help you. 

To demonstrate this, you can start by running two alpine containers.  Use the -it flags to run it in interactive mode and the -d flag to run it in the background. Make sure to add the --rm flag to clean it up afterwards. Give it a name, you can use "one". The base image you will use is alpine and we will ask alpine to execute /bin/sh once it starts. Because the container is running in interactive and detached mode, this will open up a session in the container and it will prevent it to close until we use a docker stop command. You can also start an identical container called "two".

```bash
docker run -it -d --rm --name one alpine /bin/sh
docker run -it -d --rm --name two alpine /bin/sh
```

You can now use a docker exec command to log into your container. You will use the -it flags to run this command in interactive mode. Specify the container on which to execute a command, this will be container "one" and specify the command to be executed. We execute /bin/sh to open up a shell session inside the container.

```bash
docker exec -it one /bin/sh
```

You are now inside the container. If you try to do 

```bash
ls
```

you will see the content of the file system of this particular container. If you try various commands that would normally work on your laptop, they most likely won’t work. For example, you can try to run docker ps to see the running containers and you will get an error message saying that docker is not found.

```bash
docker ps
```

Once again, this is because your container is entirely isolated. As far as this container is concerned, Docker was never installed. The alpine image comes with a very limited set of tools and is ideal for lightweight images. It comes pre-packaged with ping which is the only one you will need for now. Docker took care of networking your container to the outside world using your network interface. This is why you can ping various services from inside the container. If you try to reach the redhat.com website, you should see the response time

```bash
ping redhat.com
```

You can use Ctrl-C to stop the ping command. If that works, you should be able to ping the other container, right? Try to ping the container called two

```bash
ping two
```

You will get an error message. Once again, as far as this container is concerned, the container named "two" does not exist.  You can exit the shell session with the exit command and you can stop those two containers from running.

```bash
exit
docker stop one
docker stop two
```

Now you need a way for the two containers to talk to each other. Docker has a tool called networks to help you with this. The first thing you will want to do is to create a network. A network will create a group of containers that can talk to each other. To create this network you use the docker network command. We will "create" a new network and give it the name "alpine-network". Now every container that we add to this network will be able to see each other. You can add a container to this network by using the --network parameter in the docker run command. Do it for the two alpine containers you had running earlier.

```bash
docker network create alpine-network
docker run -it -d --rm --name one --network alpine-network alpine /bin/sh
docker run -it -d --rm --name two --network alpine-network alpine /bin/sh
```

You two containers are now running and are part of the same network. You can see the network configuration with the docker network inspect command.

```bash
docker network inspect alpine-network
```

From here, you can see the containers that are part of this network along with their internal IP addresses. Now let’s log back into the container called "one".

```bash
docker exec -it one /bin/sh
```

From here, you can try to do a ping to the container called "two" again.

```bash
ping two
```

And you should see that the container is successfully pinged. Docker also added the names of the containers to the internal host list so you don’t have to learn the IP addresses of the containers, you can reach them by their name. You are now ready to apply those same principles to your application. First, start by creating the k8scourse network. Then, start your database with the additional --network parameter. And finally, start your backend with the --network parameter as well.

```bash
docker network create k8scourse
cd db
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql --network k8scourse mysql:5.7
docker run -p 3000:3000 -d --name back --rm --network k8scourse k8scourse-back
```

If you try to reach the /health route, you are still getting an error message saying the backend can’t connect to the database server. 

```bash
curl localhost:3000/health
```

That’s because the API tried to connect to a database on localhost but it actually now runs in a container called k8scourse-db. Remember how we added an environment variable for the database server? This is where it will come in handy. You can restart your backend by added it -e parameter to pass it the name of the database server.

```bash
docker stop back
docker run -p 3000:3000 --name back --rm --network k8scourse -e MYSQL_HOST=k8scourse-db -d k8scourse-back
```

Note that this container was running in detached mode. If you want to verify that your containers are indeed running, you can use docker ps

```bash
docker ps
```

And if you want to see if there are any error messages in your backend service, you can view the logs with the logs command followed by the name of the container. If everything worked, you should see a message saying that the server is running.

```bash
docker logs back
```

Now that we have a working database and backend, it’s time to go back to our frontend and build another container to serve those files. This will be done in the next lesson.
