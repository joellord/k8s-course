# Lesson 3 - Running Your First Container

Before you spin up your first container, let’s take a quick look at what a container is.

In this course, I will be using Docker for most of my container management. Docker is simply one of the tools that can be used to run containers. I usually like to use Podman as my container engine but it’s only available for Linux right now. 

Docker comes with a virtual machine that will let you run containers in any operating system. But it’s interesting to know that they are both 100% equivalent and each command I will be showing here will also work on Podman should you decide to use that alternative instead.

So, what is a container exactly? Well, you can think of a container as a way to package up all of an application, its source code, its configuration and everything else it needs to run into one single package. 

Essentially, imagine one big zip file that would contain your source code or executable along with all the applications required to run it. This way, instead of shipping your source code, you are actually shipping your source code along with a web server pre-configured and ready to use.

Let’s start your first container.

Head to your terminal window. From here, type

```bash
docker run hello-world
```

Docker will now pull the image from its registry and run this image.  You should see a welcome message from Docker.

This image contained an operating system and contained a txt file. Once the container was started, it outputted the content of that file. The container was then stopped.  That’s it, you’ve just run your first container. Congratulations!

To get a better feel of what just happened, let’s try another example. First, let’s output some content into a file. Using your editor or with an echo statement, you can create a file called hello.txt. This file will have a simple message.

```bash
echo "Hello from the container" > hello.txt
```

And now, we can use the "alpine" image which is a minimalistic version of Linux that is great for creating small containers.  Let’s start by using a docker run command again. Now, you will mount a volume. What this means is that you will take a folder from your machine and map this into a folder accessible from within the container. In this case, you will take your current working directory and map it to the /app folder inside the container. Next, you tell docker to run the "alpine" image. Finally, you specify a command that you want to execute once the container is started.  In this case, you can ask Alpine to use the "cat" command which is a command in Linux that prints a file to the standard output, to show the content of the hello.txt file.

```bash
docker run -v $(pwd):/app alpine cat /app/hello.txt
```

The result should be a line that says hello from the container.

You can also log inside a container by running Docker in interactive mode with the -it flags. Say you want to see the content of the file system inside our container this time. You will use a very similar command. First, we need to add the -it flags. And we will change the command to be executed to /bin/sh instead. This will open up a shell session.

```bash
docker run -it -v $(pwd):/app alpine /bin/sh
```

You should see `/#` now, which is the prompt for our shell. From here, you can cd into /app and view the content of the hello.txt file.  To exit the session, you can use exit.

```bash
cd /app
cat hello.txt
exit
```

Containers can be very useful to emulate various environments. You can also use much more complex containers. In this case, we had a container with a simple operating system but a lot of containers will include a bunch of executables and runtimes. You could, for example, start a container that has the latest version of NodeJs installed by running the image called "node". Just like in our previous examples, you can specify a command to be executed once our container is started. In this case, you will ask NodeJs to evaluate the following statement. Console.log(process.version).

```bash
docker run node:latest node -e "console.log(process.version)"
```

This will start the container, execute that command and you should see a version number as the output. Note that if you run

`node -v` in your local environment, this might be a different version number. This is because the runtime for NodeJs that ran that first command is not the same as the one you have installed on your machine. In fact, you don’t need to have NodeJs installed at all to run Node, as long as you have docker.

This can be very useful if you want to share your code with another team for testing purposes. It doesn’t matter what runtimes they have installed on their laptops, by using a docker command, you will be able to specify what runtimes to use to execute your code.

Another neat thing that you can do with containers is to pass environment variables to your container. This way, you could pass it something like the base URL for your API. Your development team would then be able to use a different API than your production server. To pass an environment variable to a container, you can use the -e argument. In this next example, you can use the -e to pass an environment variable than will then be outputted by NodeJs.

```bash
docker run -e NAME=World node:14 node -e "console.log('Hello ' + process.env.NAME)"
```

Now try replace the environment variable with your own name.

```bash
docker run -e NAME=Joel node:14 node -e "console.log('Hello ' + process.env.NAME)"
```

And you should see NodeJs output Hello `<your name>`

This brings us back to your application. In this case, you need a database to be able to start the server. Here’s how you can run a database using a container.  First, you will use that same docker run command we used for the previous examples. Next, you will need to map some ports. In this case, we are telling docker that any request coming to port 3306 on this machine will be forwarded to the port 3306 inside the container, which is the default port for MySQL. You’ll want to run this container in detached mode, which means it will run in the background. To do this, you add the -d flag. You’ll also eventually want to interact with this container so you’ll need to give it a name. You can use the --name argument to do so. Next, MySQL will need a few environment variables to configure itself when it starts. You will need to add values for the user, password and the root password. All of these can be added using -e for each key-value pair. Finally, the image you will be using is MySQL version 5.7.

```bash
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```

You should then see a long hexadecimal string. That is your container id. To validate that your container was started, you can use the command

```bash
docker ps
```

This will list any running containers you currently have. You can see some basic information here like the ports that we mapped as well as the name of this container.

If you want to stop this container, you can use the first few characters from the id or the actual name of the container with the docker stop command

```bash
docker stop k8scourse-db
```

If you run docker ps again, you will notice that there are no more running containers. You can now restart this container. with the previous command.

```bash
docker ps
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```

You should be getting an error. This is because we are trying to start a container called k8scourse-db but we already had a container with this name in our internal registry. To restart this server, you will need to remove the previous container first.

```bash
docker rm k8scourse-db
```

And now restart the container with the previous command again but this time, add the --rm flag. This will take care of automatically remove this container once it stops.

```bash
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm mysql:5.7
```

You now have a running MySQL server on your machine. Everything came pre-configured for you and just works out of the box. If you share this same command with your team members, they will all be able to run the same database. Now you can go back to the back-end and start that server again.

```bash
cd back
node .
```

And there’s an error message again. Well, I guess we are making progress as it is a different one this time.  This time, your server is complaining about a missing database. And that makes sense. We are running a fresh install of our database right now so there is no data in there. 

Here’s a neat trick. A lot of containers will have a folder from which any file present will be executed before actually start the server. In the case of MySQL, any .sql file in the /docker-entrypoint-initdb.d/ folder will be executed against our MySQL server as soon as the container is started. If there were any .sh files in here, they would also be automatically executed.

In the /db folder of your application, there is a .sql file. This SQL script will create the database, add the necessary table for our application and pre-populate the table with a single entry.  You can view the content of the file by running 

```bash
cd ..
cd db
cat init.sql
```

In order to put this init.sql file in the folder that MySQL will use to populate the database, we will mount a volume with the -v flag. First, make sure that the MySQL container is stopped. 

```bash
docker ps
docker stop k8scourse-db
```

Then you will need to tell docker to use the init.sql file on our machine and map it into the /docker-entrypoint-initdb.d folder of our container. Using the previous command, we will add the -v flag and map the init.sql file from the current working directory and map it into the /docker-entrypoint-initdb.d folder.

```bash
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql mysql:5.7
```

And now, you can head back to your server and start it again. Now if you try that curl command again, you should see a server status JSON object that shows the db as being true.

```bash
cd ..
cd back
node .
curl localhost:3000/health
```

You should see a message saying that the server is now running. If you stopped your front-end server previously, you can start it again with

```bash
cd ..
cd front
npm run serve
```

Now point your browser to [http://localhost:8080](http://localhost:8080) and you will see the running application. You should immediately see an entry on the home page for an image with no caption that has the label "Hello".

If you go to the Generate Meme tab, you will be able to enter a keyword and see a random image. You can generate a new image from here. Or you can add a caption and hit the captionize button. This will send a request to the NodeJs server to decompose the GIF and recreate it with the caption. Finally, you will have the option to save it to the gallery which will add an entry to the database.

One last thing about containers. They are ephemeral. They are meant to be easily be disposed of. And once you stop them, no changes that you did to them will be saved. If you go back to your terminal and restart the MySQL server

```bash
docker stop k8scourse-db
cd ../db
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql mysql:5.7
```

This will restart the server with a brand new database with the initial set of data specified in the init.sql file. Check your server to make sure that it is still running. When you disconnected the database, it might have caused an error that crashed the server.

```bash
cd ../back
node .
```

And now go back to [http://localhost:8080](http://localhost:8080) and refresh the page. You will see that any images you saved previously have now disappeared. This is great for testing since you always start fresh. But it is a problem for your production server where you’ll want to persist this data. You can mount a volume that will contain your database in order to save this data, but this will be tackled in a later lesson.

Congratulations, you’ve now started this application. In this lesson, you used docker to start a MySQL server and your application is now connecting to it. All of this without you having to actually install MySQL. Hopefully, you can start seeing how containers can be useful now. 

In the next lesson, we will see how we can package the rest of our application so that all the components are running in containers so you can share with the rest of your team without having to worry about what runtimes they are using.
