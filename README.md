# From Dev To DevOps Wizard

- [From Dev To DevOps Wizard](#from-dev-to-devops-wizard)
  - [Lesson 1 - Intro](#lesson-1---intro)
  - [Lesson 2 - Starting the application](#lesson-2---starting-the-application)
  - [Lesson 3 - Running Your First Container](#lesson-3---running-your-first-container)
  - [Lesson 4 - Containerize the Back-end](#lesson-4---containerize-the-back-end)
  - [Lesson 5 - Networking in Docker](#lesson-5---networking-in-docker)
  - [Lesson 6 - Containerize the front end with a multi-step build](#lesson-6---containerize-the-front-end-with-a-multi-step-build)
  - [Lesson 7 - Using Environment Variables In Front-End Applications](#lesson-7---using-environment-variables-in-front-end-applications)
  - [Lesson 8 - Creating non-root images](#lesson-8---creating-non-root-images)
  - [Lesson 9 - Share images on public registries](#lesson-9---share-images-on-public-registries)
  - [Lesson 10 - Using Docker Compose To Share An Entire Application](#lesson-10---using-docker-compose-to-share-an-entire-application)
  - [Lesson 11 - Intro to Kubernetes](#lesson-11---intro-to-kubernetes)
    - [Cloud-Based Kubernetes](#cloud-based-kubernetes)
    - [Minikube](#minikube)
    - [Code Ready Containers](#code-ready-containers)
    - [Using kubectl](#using-kubectl)
  - [Lesson 12 - Create your first pod](#lesson-12---create-your-first-pod)
  - [Lesson 13 - Create a Toolbox pod](#lesson-13---create-a-toolbox-pod)
  - [Lesson 14 - Create the front-end deployment](#lesson-14---create-the-front-end-deployment)
  - [Lesson 15 - Create the front end service](#lesson-15---create-the-front-end-service)
  - [Lesson 16 - Expose Your Application To The Outside World](#lesson-16---expose-your-application-to-the-outside-world)
  - [Lesson 18 - Use paths to expose multiple services](#lesson-18---use-paths-to-expose-multiple-services)
  - [Lesson 19 - Change Environment Variables For A Deployment](#lesson-19---change-environment-variables-for-a-deployment)
  - [Lesson 20 - Persist Data And Volumes](#lesson-20---persist-data-and-volumes)
  - [Lesson 21 - Deploy Your Database](#lesson-21---deploy-your-database)
  - [Lesson 22 - Seed the Database And Connect The Backend](#lesson-22---seed-the-database-and-connect-the-backend)
  - [Lesson 23 - Unmonolithize Your Backend](#lesson-23---unmonolithize-your-backend)
  - [Lesson 24 - Clean Up Regularly With A Cron Job](#lesson-24---clean-up-regularly-with-a-cron-job)
  - [Lesson 25 - This Is The End](#lesson-25---this-is-the-end)

## Lesson 1 - Intro

Hi and welcome to this course on Containerization and Kubernetes Deployment. In this course, you will learn the basics of containers and container orchestration.

In the next lessons, we will start by taking an application that was configured for a development environment and deploy it on a Kubernetes cluster. This will be done step by step.

First, you will need to tweak your application so that it can run in containers. Then, you will see how you can use containers to complement your application and run a database without even install the actual software. Eventually, you will create a whole environment with your containers that will enable you to start all the applications with a single command. This can be useful to share the application with your colleagues.

Once you are familiar with container, you will start to explore Kubernetes. You will learn about the basic building blocks and how they all fit together to create and deploy your application. You will also see how you can persist data for your production environment. Eventually, as you get more comfortable with Kubernetes, you will also see how you can break down your monolith application into smaller microservices and deploy those in your cluster.

I hope you are excited to learn all of this! If you are ever blocked, if you need any help or even just to say hi, you can easily get in touch with me via Twitter. My handle is joel__lord and I usually answer back pretty rapidly. My DMs are always open if you need to get in touch.

Before you get started, you will need a few things. First, this application is built with NodeJS. It will be useful but not necessary to have NodeJS installed on your machine so you can test everything locally. If you don’t have NodeJS installed, don’t worry. You won’t be able to run the application locally but as you learn more about containers, you will see how you can use those to run the application without installing NodeJs. To install Node, you can go to http://nodejs.org to find the installation instructions for your operating system.

I am using a Linux operating system on my laptop. The instructions that I will show you will run on both Linux and macOS but might not always work on Windows. I will assume that you have the necessary knowledge about your operating system command-line tools to be able to navigate the folder structure and copy files around. You shouldn’t need more than that.

Next, you will need a container runtime. The examples in this course will be using Docker so you will need to install it for your operating system. Installation instructions can be found at [http://docker.com](http://docker.com). If you are using a Linux based operating system, you can use Podman instead which is a little faster than docker. You can find more information on Podman at [http://podman.io](http://podman.io). If you choose to use the latter, you can create an alias with the command

```bash
alias docker=podman
```

so that you can still use the instructions that will be specified in this course. Podman uses the exact same syntax as docker which makes it easy to switch from one to the other.

In order to download the source code for this application, it would be useful to have git installed on your machine. You can find more information on git at [http://git-scm.com](http://git-scm.com).

For the Kubernetes part, you will need a few more tools. First of all, you will need the kubectl command-line tool to be able to interact with your Kubernetes cluster. You will find all the installation instructions for kubectl at [https://kubernetes.io/docs/tasks/tools/](https://kubernetes.io/docs/tasks/tools/). On that same page, you will also find instructions on how to install minikube. Minikube is a tiny distribution of Kubernetes that can run on your laptop. As we get in the section about Kubernetes, you will see various options that you can use to use Kubernetes but minikube is a good tool to have either way.

Finally, this application will use Giphy as a source of random images. Because I don’t want to exceed my daily quota of random gifs, you will need to use your own API key. You can find out how to do so by going to [http://developers.giphy.com](http://developers.giphy.com) and then click on the "Get Started" button. From there, follow the instructions to create your first application and to get your API key.

If you don’t want to install those tools, there is a container that has all of the tooling necessary that was already created for you to use. The only thing you will need to get this started is Docker. If you have Docker installed, you can use the command in the ./tools/course-env.sh file to start the container with all the tools installed. You will even be able to run Docker from within this container.

That’s all you need for now. You are now ready to get started and to explore the wonderful world of containers and Kubernetes.

## Lesson 2 - Starting the application

The application we will look at today is an application that will take random GIFs from Giphy and add a caption to it. This application is entirely built with JavaScript. It has a NodeJS backend and a VueJs front-end.

The application UI is simple. It asks for a keyword and will search and display a random GIF from Giphy. Once you are satisfied with the image, you will be able to add a caption to it. The server will deconstruct the GIF frames, add the caption and re-create the GIF for you. Everything is then saved to a database so that all the users can benefit from your creations.

Seems nice, right? Let’s try to start our application.

First, let’s clone the Git repository that contains all of our code. This can be done in your terminal by using

```bash
git clone https://github.com/joellord/k8s-course.git
cd k8s-course
```

You should now have three folders. One for the front end, one for the back-end and one for your database. First, let’s start our front-end.

```bash
cd front
npm install
npm run serve
```

Now open up a browser and point it to [http://localhost:8080](http://localhost:8080).

You should see the application. If you try various actions, you will notice that nothing works for now. That’s because we don’t have a server started yet.

First, you will need to update the application to use your Giphy API key. To do so, open up the `back/apiKeys.js` file and update the value of the giphyKey variable to your actual Giphy API Key. 

Your `back/apiKeys.js` file should look like this:

```javascript
const giphyKey = "YOUR_GIPHY_API_KEY";

module.exports = {
  "GIPHY": giphyKey
}
```

Once this is done, you will be ready to get started with the server.

You can now open up a new terminal window, and go to the back folder.

```bash
cd ..
cd back
npm install
node .
```

You can test that the server is running by doing a curl or by opening the browser to [localhost:3000/health](localhost:3000/health). This route should give you the current status of the server.

```bash
curl localhost:3000/health
```

Wow, we’re off to a good start, aren’t we? We’ve got our first bug. You can see that there is an error code that specifies ECONNREFUSED.

You can dig into the error trace to see where this originates from if you’d like. You will quickly notice that this error comes from the fact that we don’t have a running MySQL server. Our application requires a connection to the database to list the previous GIF creations to the visitors of the web site and without a running database, nothing works.

Note that you might also receive a message at this point that specifies something like Access denied for user 'root'@'172.17.0.1' (using password: YES). If that is the case, you probably have a running MySQL server running on your machine at the moment and you will need to stop it before you can continue to the next step.

So, how can we start a database without spending too much time configuring this database? This is where our containers will come to help us.

In the next lesson, we will start our first container that will contain the necessary database.

## Lesson 3 - Running Your First Container

Before you spin up your first container, let’s take a quick look at what a container is.

In this course, I will be using Docker for most of my container management. Docker is simply one of the tools that can be used to run containers. I usually like to use Podman as my container engine but it’s only available for Linux right now. 

Docker comes with a virtual machine that will let you run containers in any operating system. But it’s interesting to know that they are both 100% equivalent and each command I will be showing here will also work on Podman should you decide to use that alternative instead.

So, what is a container exactly? Well, you can think of a container as a way to package up all of an application, its source code, its configuration and everything else it needs to run into one single package. 

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

## Lesson 4 - Containerize the Back-end

In the last session, you started a MySQL server by using a container that you pre-configured with everything needed to run this server. You used an image that was pre-built by the MySQL team. What happens if you want to create your own image to be shared with your team. This is what we will see in this lesson.

You will learn how to create your own images that will include all the source code of your application, along with a specific version of NodeJs and all the dependencies that are needed. Once you are done, you will be able to share this image with other people and this will ensure that everyone is running the same environment. It will event let people that don’t have NodeJs run this server.  This will also have the added benefit of cleaning up everything once you close the application. 

If you tried to create a few memes in the last lesson, you will notice that you have a bunch of files in you /tmp folder

```bash
cd back/tmp
ls
```

These are the files that are created during the process of extracting the frames and re-generating the captioned GIF. When we will run this application inside a container, all of this will be cleaned up as soon as we stop this container.

The first thing you will want to do in order to prepare your application to run into a container is to identify any variable that could be stored in an environment variable. This would be any value that would vary based on where the code is running. Examples of this would be a base URL for your API. It would most likely be different for your production environment, test environment and development environment. The same could go for log files. Or, in the case of this application, the database configuration. Thankfully, the software developer that worked on this project isolated those variables in a file called config.js so you won’t have to dig too far. For each of the values in this file, you can change it to use a matching environment variable. You can leave the default values there for now by using the "or" operator (the double pipes). This way, if your application can’t find an environment variable, it will fall back to the default values, so your application will still run locally without adding those variables.

```javascript
// back/config.js
const config = {
 MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
 MYSQL_USER: process.env.MYSQL_USER || "root",
 MYSQL_PASS: process.env.MYSQL_PASS || "root",
 MYSQL_DB: process.env.MYSQL_DB || "images"
 ...
}

module.exports = config;
```

Another variable that could change would be the Giphy API key. This value will need to stay a secret but you’ll want your server to be able to download the code from your repo and run everything. By storing this value in an environment variable, you will be able to keep it a secret and store this value on the server instead of in your source code. This variable is found in the apiKeys.js file. You can do the same thing here.

```javascript
// apiKeys.js
const giphyKey = process.env.GIPHY;
module.exports = { GIPHY: giphyKey };
```

Don’t put in a default value here. This will let you go in your .gitignore file and remove that apiKeys.js line. This file will now be added to your repository and will rely on an environment variable to get the value of the API key.

Next, you will want to create an image that can then be shared with the rest of your team.

To create your own image, you will use a Dockerfile. This file will describe how this image is to be created. It will list a series of layers to create your own custom image. A Dockerfile always starts with a FROM statement. This tells docker what base image to use and will build on top of it.

For your backend, you will start with a FROM node:14. So go ahead and create a file in the back folder that is called Dockerfile.

```bash
cd back
touch Dockerfile
```

You can now create your Dockerfile. It will be based on the Node:14 image which contains both the Node executable and npm.

```docker
FROM node:14
```

Next, you will specify a working directory for our application. This could be anything, you can use /app for this example.

```docker
WORKDIR /app
```

Next, you will also need to create two subfolders that are used by the application. The RUN command will let you specify a command to be executed inside the container. Note that those two folders will be created inside the /app folder since we specified this to be the working directory in the last step.

```docker
RUN mkdir tmp
RUN mkdir assets
```

Now, you can copy both your package.json and package-lock.json files, and run the npm install command to install all the dependencies needed by your application. Note that you are only copying the package.json file here and not the entire directory. This will allow you to create an image take takes full advantage of the Docker layer caching, and it will significantly speed up your build process.

```docker
COPY ./package*.json /app/
RUN npm install
```

Next, you can copy all the code and assets that are required for your application.

```docker
COPY *.js /app/
COPY assets/* /app/assets/
COPY tmp /app/
```

And finally, you will need to specify which command is executed to start the server. In your case, the main file for the server is /app/index.js so you can use the command node /app

```docker
CMD ["node", "/app"]
```

Your full Dockerfile should look like this

```docker
# Dockerfile
FROM node:14
WORKDIR /app
RUN mkdir tmp
RUN mkdir assets
COPY ./package*.json /app/
RUN npm install
COPY *.js /app/
COPY assets/* /app/assets/
COPY tmp /app/
CMD ["node", "/app"]
```

You now have a set of instructions that Docker will use to create your image. In order to start this image build, you can use the command docker build. You will also need to name your image. To do so, you will use the -t flag to specify a tag. You could also add a version number after the name of your image if you’d like. If you don’t it will automatically append the :latest tag as the version number. Finally, you need to specify the path to the Dockerfile that you wish to build. In this case, the file is located in the current directory, or ".".

```bash
docker build -t k8scourse-back .
```

You should see each of the 10 steps being run and see a message telling you that the image was successfully built. You can now test this image with a docker run command. This will be very similar to the containers you’ve started in the previous lessons.

First, you will use docker run. You will then need to map some ports. The back end of this application is running on port 3000 so let’s map this port directly to the port 3000 of your local machine. Then you can give it the k8scourse-back name with the --name flag. Next, you will want to run this in detached mode to run the container in the background with the -d flag and you will want to clean up the container when it closes with the --rm flag. Finally, you can use the name of the image that you used in the build step.

```bash
docker run -p 3000:3000 --name back -d --rm k8scourse-back
```

Now try hitting your API to make sure that it is running. You can do that by opening a new browser tab and looking up [http://localhost:3000/health](http://localhost:3000/health) or by using the following command in your terminal.

```bash
curl localhost:3000/health
```

Either way, you should be getting an error. It seems like the server isn’t started. Because the container is running in the background, you could never see the detailed error message. The server actually crashed. You can stop the docker using the docker stop command and then validate that it is not running anymore with the ps command.

```bash
docker stop back
docker ps
```

This will list any running containers that you have on your system. You might have the k8scourse-db container still running but you shouldn’t have the k8scourse-back container. To see what happened, you can execute the docker run command without the -d flag. The container will now output everything that the Node Js application would output in the standard output.

```bash
docker run -p 3000:3000 --name back --rm k8scourse-back
```

You can now see that the application starts and outputs an error of type ECONNREFUSED. Does that remind you of anything? We’re back to the start it seems. The NodeJs back end application can’t find the database anymore. 

This is because the container is looking for a database on the "localhost". But localhost, in the context of the container, only has the back end service in it. You can now stop this container from running.

```bash
docker stop back
```

You will need a way to tell your application how to connect to the database by using a network. This is what you will see in the next lesson.

## Lesson 5 - Networking in Docker

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

## Lesson 6 - Containerize the front end with a multi-step build

In the last lessons, you saw how to use containers and how to create one for your backend. Now is the time to see more advanced container images. In this lesson, we will actually use a container to build our container. This is called a multi-stage build. 

For your front end, a VueJs application has been created from the CLI. VueJS, just like React and Angular applications have a development mode as well as a production mode. When you started the front end at the beginning of this course, you’ve used "npm run serve". This is a development server that is built with NodeJs. It watches your files for changes and is optimized to recompile the application and refresh your browser automatically. This is great for development. 

Once you are ready to deploy this application, you won’t want to use the same code. In fact, you will need to run another script to build a production application. This script will take all of your JavaScript files and merge everything in a single minified JavaScript file. It will do the same for your CSS. By doing so, you will end up with a minimal set of files that can be served over any static file webserver. In this case, you will be using an Nginx server to serve those files. Nginx is an open source, high-performance HTTP server that will be able to handle many requests to your front end.

When building our front end container, we will only want a container that has Nginx and the minimal HTML, CSS and JavaScript files, not the full NodeJs runtimes. This is why we will use a multi-step build. The first step will use a container with NodeJs to create the files and the second step will be our Nginx server with the files.

Just like in our previous examples, your container will need to start with a base image. In order to build our application, we will need Node and NPM so we can start from Node and we will give an alias to this container by using the AS keyword. Create a new front/Dockerfile and start with the FROM statement.

```docker
FROM node:14 AS builder
```

Next, you can copy all of your source code over and change your working directory to the /app folder where your application is now stored inside your container.

```docker
COPY . /app
WORKDIR /app
```

Now, we can ask this container to install any dependencies and then run the npm script that will build our production version. For a VueJs application, this will create a /app/dist folder with those static files.

```docker
RUN npm install
RUN npm run build
```

You now have a container with the production version of your application that is ready to go, but this NodeJs container can’t serve the files. It doesn’t have a server built-in. What you will need to do now is to create another container with an Nginx server and copy the files from the first step into the second container. You can start from an Nginx base image and change your working directory to /usr/share/nginx/html, which is the default folder from which Nginx will serve files.

```docker
FROM nginx:1.17
WORKDIR /usr/share/nginx/html
```

Now, we can copy the files from the first container into this new container by using the --from parameter and the alias that we gave to that first step. We will take the files from the /app/dist folder, which is our "compiled" website and copy them into the working directory of this second container.

```docker
COPY --from=builder /app/dist .
```

The Nginx image already exposes the port 80 and automatically starts the server once the image is started so you don’t need to do anything else, everything will be handled for you.

Your entire Dockerfile should look like this

```docker
# Dockerfile
FROM node:14 AS builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx:1.17
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
```

Now head to your front folder where this new Dockerfile is located and run a Docker build command to create this new container.

```bash
docker build -t k8scourse-front .
```

Your front-end is now containerized. You can start this image by executing a docker run. Add the -d flag so it runs in detached mode. Also, add the --rm and --name. Finally, add a port mapping. Nginx is running on port 80 inside the container but you will need to map it to another port on your machine. You can map it to port 8888 by using -p 8888:80.

```bash
docker run -d --rm --name front -p 8888:80 k8scourse-front
```

Open up a browser and head to [http://localhost:8888](http://localhost:8888) and you should see the application running. If you try to get an image, it should fail if you don’t have a back-end container running. If that’s the case, you can start the database and the back end with a docker run, just like you did in the previous lessons.

```bash
cd ../db
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql --network k8scourse mysql:5.7
docker run -p 3000:3000 --name back --rm --network k8scourse -e MYSQL_HOST=k8scourse-db -d k8scourse-back
```

Note: You might have to wait a few seconds before running the back end server. This is because it will attempt to connect to the database immediately but the MySQL might not have had the time to initialize properly yet. If you run a docker ps and you don’t see the back end service, try do execute that second docker run statement again. You could also try to run it without the -d to see the output and ensure that it was started.

Now that all the services are started, go back to your browser, to the [http://localhost:8888](http://localhost:88880) page and you’ll be able to test out the application. 

Interestingly, you didn’t need to add the front-end to your k8scourse network. This is because the front end is living in your browser. Any requests that are made by the front end are actually made by your browser, on your development machine. Those requests are reaching out to the internet, to the server called localhost. It just so happens that this server is your local development machine.

Everything should now be working. Well, almost. Once you deploy this application, there is a chance that you might want to run your backend service on another server than localhost. Let’s simulate this. First, we will stop the backend with docker stop and then reuse the same command to restart it, but map the port to the localhost port 3001 this time.

```bash
docker stop back
docker run -p 3001:3000 --nameback --rm --network k8scourse -e MYSQL_HOST=k8scourse-db -d k8scourse-back
```

The application is broken again. If you open up the developer tools, you can see that all the requests are still going to port 3000. It seems like the value of the back end was hard-coded in the front end code. Your application will work as long as all the containers are running locally, but will break down if you move the back end to another server or to another port.

To solve this issue, we would need to use environment variables. But this will cause some issues on the front-end due to the fact that the front-end lives in the browser, and not on the server, where the environment variables are stored. We will see how to solve this in the next lesson.

## Lesson 7 - Using Environment Variables In Front-End Applications

In the previous lesson, we managed to put all of our front-end in a container and we can now distribute this container to the rest of our team. This will work well with stand-alone websites but as soon as you need to connect to an API, this could become an issue. You will need to specify the base URL of your server and this would need to be done as an environment variable. The problem here is that since our application lives in a browser, it can’t read the environment variables from the server.

There are a few solutions to this problem. First, you could run a NodeJs server and serve your files from there. This way, you could add an additional /config route to your server. This route would return an object containing all the configuration from the environment variables. 

```javascript
app.get("/config", (req, res) => {
  res.send({ BASE_URL: process.env.BASE_URL }).status(200);
});
```

This could work but requires many changes in our architecture. First, we won’t be using an Nginx server anymore which will be a performance decrease. And next, we need to make sure that our front end calls this configuration route before anything else to avoid running into race conditions. 

Another option would be to use another language to render a page from the server. PHP could do a great job at this. The index.html can be renamed to a .php file and using a little bit of PHP, you can render the page with the environment variables. 

```php
<script>
const BASE_URL = <?= $_ENV["BASE_URL"] ?>
</script>
```

Once again, we would need to change the server type as Nginx alone can’t render PHP files. We would also need to change the template from our application to use a PHP file instead. And finally, well, we’re mixing up languages.

Those solutions require some changes in your actual code base and to the way you are used to doing things. A better solution might be to do everything through a Dockerfile. We are already using Docker to initiate our build process. By adding a few commands, we can change those variables to something more generic in our build process. And then, just before our server starts, we can inject the environment variables into our configuration. This way, we don’t need to change anything in our development environment and we can keep our Nginx server for high performance and small footstep.  This is what we’ll do in this lesson.

In the last lesson, you’ve seen that all requests were made to http://localhost:3000. This means that this value was hard-coded somewhere in the front end source code. The first thing you will want to do is to find out where this was coded and make sure that it is only defined in one place. If you do a search for localhost:3000, you will see that it is only defined in one place. That’s good, half the work is done already. You will only need to modify the front/src/config.json file. But this value works well for our local development environment and maybe other developers on your team are using different values. For this reason, you will leave this value hard-coded in there, and you will change it as part of the build process in the Dockerfile.

To change this value, we will use jq. Jq is a command-line tool that makes it easy to change values in a JSON file. The base image that we used for building the application does not contain this tool, but that is not an issue. Because a container is essentially just like a Linux machine, you can install the software in your image and then use this tool to perform various operations. To install jq, you will need to download the binary. To make it easier to eventually upgrade it is there is a security vulnerability of some sort, you can add the version number as an environment variable. You can specify this variable with the ENV keyword. This should be added right after the WORKDIR line from your existing Dockerfile

```docker
# Dockerfile
[...]
WORKDIR /app
ENV JQ_VERSION=1.5
```

Next, you can download jq from the Github repository https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64. Note how the JQ_VERSION environment variable is used in the URL. Jq will be downloaded using wget which is already installed in the base image. You will also need to specify wget to ignore certificates and to output the content of this URL into a file in the /tmp folder. Next, you will copy this binary file into the /usr/bin folder so that it is now in the default path for executables. And finally, you must change the permissions on that file so that is can be executed. This is done with the chmod command.

```docker
RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq
```

Now that jq is installed, you will be able to use it to change the value of the BASE_URL property of the config.json file. To do so, change the working directory to the /app/src folder and then use RUN to execute the following command. First, we tell jq to execute the command jq '.BASE_URL = "$BASE_URL"' config.json. This finds the BASE_URL property in the config.json file and replaces the value of it with "$BASE_URL". The output is then stored in a variable called $contents. Once this is done, you can echo the content of this variable back into the config.json file to overwrite the content of the existing file. These Docker instructions should be placed right after the jq installation lines.

```docker
WORKDIR /app/src
RUN contents="$(jq '.BASE_URL = "$BASE_URL"' config.json)" && echo ${contents} > config.json
```

The result will be to change the config.json file to now have the following content.

```javascript
{
 "BASE_URL": "$BASE_URL"
}
```

There are easier ways to do this. You could’ve simply overwritten the config.json file with the given content. The nice thing with jq is that you only changed the value of one of the JSON properties. If your developer team added more values to this file, the script in the Dockerfile won’t change the rest of the file. This makes it a safer way to change only the values that need to change in this file. You could also add more jq commands to overwrite other values in this config.json file that you need to overwrite with environment variables.

Now that your configuration file has been changed to a generic value, you can run your npm install and build scripts. This will create all the minified CSS and JS files, with this generic value.

The next step will happen in the second step of our container. Just before the server starts, you will need to overwrite this $BASE_URL in your JavaScript package with the actual value of the BASE_URL environment variable. In order to do so, you will need to bypass the command that the Nginx base image uses to start the server with a different start script. This new script will use the envsubst command that is included with this image to substitute the $BASE_URL string with the actual value of it from the image environment variable. Now when you will start the container with a -e flag, it will take this value and overwrite the $BASE_URL string in the JavaScript file. Once this file is server to the browser, it will now contain the value from the environment variable.

To do so, you will write a small bash script.  You can call this file start_nginx.sh and place it in the /front folder. 

First, the script will run through all the app.*.js files and rename them to app.*.tmp.js. Then, for each of these .tmp.js file, you will use envsubst to replace the environment variable $BASE_URL with the actual value from the container environment variable. The output from the envsubst command then pipes to the original file name. Once all the JavaScript files have been modified, you can start the Nginx server with the "nginx -g" command.

```bash
#!/usr/bin/env bash
for file in /usr/share/nginx/html/js/app.*.js;
do
 if [ ! -f $file.tmp.js ]; then
   cp $file $file.tmp.js
 fi
 envsubst '$BASE_URL' < $file.tmp.js > $file
done
nginx -g 'daemon off;'
```

The final step as far as our container is concerned will be to copy this bash script into the container, change the permissions on it so that it can be executed and change the ENTRYPOINT of your container. An ENTRYPOINT is a command that is executed when the container is ready. It’s usually the command that "starts" your container. There can only be one ENTRYPOINT in a container so by adding it here, you are overriding the default ENTRYPOINT that was defined in the nginx base image.

```docker
...
COPY --from=builder /app/dist .
COPY start_nginx.sh /
RUN chmod +x /start_nginx.sh
ENTRYPOINT ["/start_nginx.sh"]
```

Your full Dockerfile should now look like this

```docker
# Dockerfile
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
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY start_nginx.sh /
RUN chmod +x /start_nginx.sh
ENTRYPOINT ["/start_nginx.sh"]
```

You are now ready to rebuild your front end image and start all three containers. To rebuild your front end, go to your /front folder and run the docker build command.

```bash
cd front
docker build -t k8scourse-front .
```

You can now restart all of your containers to see those new changes. First, stop all running containers. Next, go to your /db folder and start your database. Let the database start and run your back-end container. This time, you can run it on port 3001. And finally, start the front-end server and specify the BASE_URL for your backend.

```bash
docker stop k8scourse-db
docker stop back
docker stop front
cd ../db
docker run -p 3306:3306 -d --name k8scourse-db -e MYSQL_USER=user -e MYSQL_PASSWORD=mysql -e MYSQL_ROOT_PASSWORD=root --rm -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql --network k8scourse mysql:5.7
docker run -p 3001:3000 --name back --rm --network k8scourse -e MYSQL_HOST=k8scourse-db -d k8scourse-back
docker run -p 8080:80 --name front --rm -e BASE_URL=http://localhost:3001 -d k8scourse-front
```

Now open up your browser and point it to [http://localhost:8080](http://localhost:8080). You should finally be able to try out the application. Everything is working again. And if you change any of the server ports or URLs, you will be able to use an environment variable to specify the new values and you won’t need to change your code. Also, those values such as the GIPHY API key won’t be in your repository and can be kept secret on your server. 

You are now almost ready to deploy those images to a server. Before you do so, you will have to ensure that these images run on any server. Right now, those containers are running as a root user inside their context. If you open up a bash shell and run the whoami command, you will see that you are running this session as the root user.

```bash
docker exec -it front /bin/bash
whoami
exit
```

You will need to do some small changes to your Dockerfiles to ensure that you are not running as root anymore. This will be done in the next lesson.

## Lesson 8 - Creating non-root images

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

## Lesson 9 - Share images on public registries

Finally your images are created. All three tiers of your application are available in containers. You now need a way to share these images with the rest of the world. To do so, you will need to push those images to container registries. Registries are the container equivalent to repositories for your code. Some of these registries are public, meaning that any image you push will be available to the world. Others are private so you can share images only with a small group of people that have access. 

The base images that you used to create your own images all come from such a registry. When you used the node image, it was available because someone initially took the time to create a Dockerfile and push it to a registry.

Many registries are available for you to push your images to. Docker Hub is a popular registry. In fact, if you are using Docker, the base images were pulled from Docker Hub. There are also registries such as Quay that you can install on your own infrastructure so you can keep all the images pushed to it private. In this course, you will be using Docker Hub. It offers to store unlimited public images on the free tier. To create your account, head to [http://hub.docker.com](http://hub.docker.com) and follow the instructions.

Once you have an account created on Docker hub, you are ready to store your images. The first step will be to login to the registry using the docker login command followed by the name of the registry your want to connect to. In your case, this will be docker.io. You will be prompted for your user name and password and once you filled them in, you should see a message confirming that you are logged in.

```bash
docker login docker.io
```
```
Login Succeeded
```

Now that you are logged in to Docker Hub, you will be able to push your images to the registry. In order to push the images to the registry, you will need to rename the image to <registry>/<username>/<image>. Because docker assumes docker.io as the registry, you can simply rename the images to <username>/<image>. You can use the docker tag command to rename your images. My username on Docker Hub is joellord so I will rename the images accordingly.

```bash
docker tag k8scourse-front joellord/k8scourse-front
docker tag k8scourse-back joellord/k8scourse-back
```

You never created an actual image for your database. The image that you are using is the base image from Docker Hub so no need to rename or to upload this image to the registry. You will only deal with the two images you recently created.

Now that your images have been renamed, you are ready to store those images on the registry by using the docker push command. You will need to pass in the name of the image as an argument.

```bash
docker push joellord/k8scourse-front
docker push joellord/k8scourse-back
```

This operation will take a few seconds as every layer of your images is sent to the registry. A layer is created for each command in your Dockerfile. Docker will always try to reuse those cached layers when possible. So the more you use Docker, the quicker those push will become.

Now that the images are pushed in a public registry, anyone can download those images on their system by using the docker pull command. Once they have the image downloaded, they can use Docker run to start each container just like you did in the previous steps.

```bash
docker pull joellord/k8scourse-front
docker pull joellord/k8scourse-back
```

Just like your code repository keeps a history of all your code changes, your container registry will keep a history of all the images. When you do a docker push, the registry will automatically append a :latest tag to the image. When someone does a pull of your image, docker will always pull the :latest tag. This can be useful but sometimes, you will want to ensure that everyone is running the same version of your container. You might have noticed that for the base containers, there was always a tag that was specified. For our node base image, you used node:14. For your nginx image, you used nginx:1.17. By using a tagged version of the image, you are ensuring that everyone will be using the same version of the image. Should you have omitted the version number in the node base image, version 15 would’ve been used as this is the version that is used in the :latest tag.

In the same way, you can (and should) tag your images. To tag them, you can use the docker tag command and tag your current images to a version number. Once the images have been tagged, you can push them again to the registry.

```bash
docker tag joellord/k8scourse-front joellord/k8scourse-front:1
docker tag joellord/k8scourse-back joellord/k8scourse-back:1
docker push joellord/k8scourse-front:1
docker push joellord/k8scourse-back:1
```

If you go to Docker Hub, you will see the images that you pushed. And if you click on one of the images, you will see the details, including the versions that are available. This will be useful when you want to share your entire containerized application with your team, which will be done in the next lesson.

## Lesson 10 - Using Docker Compose To Share An Entire Application

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


## Lesson 11 - Intro to Kubernetes

In the first few lessons of this class, we focused mainly on how to build containers. You saw how they can be useful and how they fit in your development workflow. Now that you took your application and containerized all of the different components, you will want to deploy all of these containers on a server. This is where Kubernetes will come into play. 

Kubernetes is an orchestrator platform. It will take care of deploying your containers and making sure that they are always running. If one of these containers should crash, Kubernetes will immediately restart it. It will also take care of the networking between the various containers that you have running in your system.

To define the various objects that compose a Kubernetes cluster, you will need to create YAML files. Those can then be applied to your cluster. This makes it easy to have all the definitions of your cluster inside a git repository.

In the next few lessons, you will take the application you just containerized and will deploy everything into a Kubernetes cluster. Interacting with your Kubernetes instance will be done with a CLI tool called kubectl. This versatile tool can connect to any Kubernetes cluster and let you interact with it from the comfort of your terminal. You will also see how to use various other tools to make it easier for you to manage this cluster.

But before you can configure kubectl, you will need a Kubernetes cluster that you can interact with. There are many options available to you.

### Cloud-Based Kubernetes
Most major cloud providers offer a variant of Kubernetes. While each implementation tends to be slightly different, the examples provided in the next lessons should be working on each one of these using the kubectl tool.

My favourite provider is Digital Ocean, you can start a 10$/month Kubernetes cluster with a few clicks and you can get 100$ in free credits with the following URL: [http://ezurl.to/digitalocean](http://ezurl.to/digitalocean).

Follow the instructions on the screen to create a single-node Kubernetes cluster. Once your cluster is created, follow the instructions from [https://www.digitalocean.com/docs/kubernetes/how-to/connect-to-cluster/](https://www.digitalocean.com/docs/kubernetes/how-to/connect-to-cluster/) to connect kubectl to your cluster and you should be good to go.

Most major providers can also offer Kubernetes clusters although they tend to be slightly more expensive.

### Minikube
Minikube is a tool to run a tiny Kubernetes instance on your laptop. You would typically run minikube if you wanted to test out your setup in a local environment. It is lightweight and is easy to use. Once you’ve installed minikube, you can use the command start to start a local Kubernetes cluster and automatically configure kubectl to use this cluster.

```bash
minikube start
```

You will need to enable the ingress add-on for one of the future steps so you might as well do it right now with the addons command.

```bash
minikube addons enable ingress
```

If you want to stop it from running, you can use the stop command.

```bash
minikube stop
```

Once minikube is started, it will be automatically be configured with kubectl and you will be ready to get started.

### Code Ready Containers
If you eventually want to use an Enterprise-grade Kubernetes cluster, you might want to look into OpenShift. OpenShift is Red Hat’s distribution of Kubernetes. It provides you with all the functionalities that come built-in with Kubernetes as well as a lot of useful tools out of the box, like a very handy UI.

If you want to try out OpenShift locally, you can use Code Ready Containers which is the equivalent of minikube for OpenShift. Once CRC is installed, you can start it with the start command.

```bash
crc start
```

This will take care of starting your local cluster. You will also have the instructions to connect to your cluster and the URL to see the dashboard. It will also take care of configuring kubectl for you. when you are ready to stop the cluster, you can run

```bash
crc stop
```

Once CRC is started, you are ready to go and kubectl will be available to you.

### Using kubectl
Once you have a running cluster, make sure that your kubectl is connected to the right Kubernetes cluster. You can see the context that kubectl is currently using with the config command.

```bash
kubectl config current-context
```

Once kubectl is connected and properly configured, you are ready to deploy your first object to Kubernetes. This will be done in the next lesson.

## Lesson 12 - Create your first pod

The first Kubernetes object that you will create is a pod. A pod is the smallest unit of deployment in a Kubernetes cluster. Pods typically contain a single container, although very closely related containers might be deployed in a single pod when a context needs to be shared. In all the examples you will see in this course, they will be single-container pods.

All Kubernetes objects follow more or less the same syntax. You start by specifying the api version to use and the kind of object, then you add in some metadata. And you finish with the spec of the object.

To create your first pod, you can start by creating a new file. You can call it pod.yaml and you can put this YAML file along with all the others you will write in a folder called k8s. In this file, you will need to specify the Kubernetes API version to use, which will be version 1 and the kind of object you want to create. In this case, it will be a Pod.

```yaml
apiVersion: v1
kind: Pod
```

Next, you need to add some metadata. You will need to give your new object a name. Kubernetes objects are usually grouped based on labels. For now, we will ignore the labels but it’s good to know that this is where they usually go.

```yaml
metadata:
  name: hello
```

And finally, we add the spec version. Spec will change for every Kubernetes object. In the case of this example, you will tell Kubernetes to use a single container. You need to specify a name for this container, which is hello. Then you tell Kubernetes which container image to use. You can use a base image here or a custom image that you have built using a docker build command. For this first pod, the base image alpine is used. Finally, you can override the entry point that is specified in a base image by adding a command array. In this case, you will tell the container to echo a Hello World and then sleep 30 seconds. Once it’s done, the container will automatically stop running.

```yaml
spec:
  containers:
  - name: hello
    image: alpine
    command: ["sh", "-c", "echo Hello World && sleep 30"]
```

Your final pod.yaml file should look like this

```yaml
apiVersion: apps/v1
kind: Pod
metadata:
  name: hello
spec:
  containers:
  - name: hello
    image: alpine
    command: ["sh", "-c", "echo Hello World && sleep 30"]
```

Once you apply this file to your Kubernetes cluster, it will download the container image if needed, and then run the specified command. Once this command is executed, the container will automatically shut down and it will consider it’s just terminated. You can apply this file to your cluster by using the apply command with a -f flag and the name of the file to apply to your cluster.

```bash
kubectl apply -f pod.yaml
```

This will create your first pod. Kubernetes will start the container you specified and execute the command in the YAML file. It is actually very similar to what you did in some of the first lessons on containers. Kubernetes uses a container runtime behind the scenes to start this container and execute the echo command. You can see the output of your container by using kubectl logs followed by the name of the container. This should output the line "Hello World". 

```bash
kubectl logs hello
```

Kubernetes does more than just running the containers though. You can see all the objects that you have in your cluster with the get command. If you want to see everything, you can use the get command with the all parameter.

```bash
kubectl get all
```

This will list all the objects in your cluster. You should see an object named pod/hello. There is also an object named service/kubernetes. That is the Kubernetes API but you can ignore that one for now. If you want to see only one type of object, you can change the all for an object kind, like pods in this case.

```bash
kubectl get pods
```

Back to the pod, you will see how many pods are ready, what is the status, how many restarts and the age of the pod. If you wait a few seconds and try the command again, you might notice some changes in the status or the restarts. If you want to monitor a pod in real-time, you can use the -w flag. 

```bash
kubectl get -w pods
```

Now that your pods are being monitored in real-time, you will see some changes. The pod should go from "Running" to "Completed". This is because the pod stops running after the sleep command we passed it in the YAML file. The main difference between running a pod in Kubernetes is that the pod will automatically be restarted. The platform will always try to keep this pod alive. This is why you should see another line that specified the pod is running again and that the number of restarts was incremented. At some point, you might also see a CrashLoopBackOff status. This is because Kubernetes noticed that this container stops just a few seconds after it started and it gives you an error message. If you want to know more about why a container is crashing, you can use the logs as we did previously or use the describe command. You will need to specify the type of resource you want details for (a pod in this case) followed by the name of the resource.

```bash
kubectl describe pod hello
```

This pod only runs a single command and then gets restarted automatically when it’s done, but most of the time, you will want to run a pod that stays up and running. You can test this out with an empty Nginx server. If you start from the pod.yaml you created earlier, you can change the image name to nginx and remove the command line.

```yaml
...
spec:
  containers:
  - name: hello
    image: nginx:1.17
```

This will create a pod that is running the base image of nginx. Because you can’t have two pods with the same name on a given cluster, you will need to delete your pod with the delete command and then apply this new file. Delete takes the type of resource followed by the resource name as arguments.

```bash
kubectl delete pod hello
kubectl apply -f ./pod.yaml
```

If you run a get command again, you will see that you have a pod called hello but this time, the pod should stay up and running.

Should you want to log into a pod, this is very similar to what you did with containers. You can use the exec command with the -it flags to open up a command in interactive mode. 

```bash
kubectl exec -it hello -- /bin/bash
```

From within your container, you can test if the nginx service is running with the command

```bash
service nginx status
```

Which should tell you that it is running. To exit the container, use the exit command.

```bash
exit
```

As you can see, pods are very similar to the containers we had earlier. The main difference being that a pod can have more than one container. Now that you are done with this single pod, you can remove it with the command delete.

```bash
kubectl delete pod hello
```

To verify that the pod was deleted. you can run a get all command again and you should only see the Kubernetes API service.

```bash
kubectl get all
```

Now all of this worked but you would never actually manually create a single pod in a Kubernetes cluster. In reality, you would use a deployment that would be in charge of managing those pods.

## Lesson 13 - Create a Toolbox pod

In the next few lessons, you will need to look at what is going on inside your cluster. In order to do this, you will create a single pod that will contain some of the basic tools that Linux provides. For this pod, we will use the Red Hat Universal Base Image. 

It is interesting to note that Kubernetes does not use exclusively YAML for the object descriptions. It can also accept JSON objects. While most of the documentation you will find will use YAML, we will create this new object using JSON just to demonstrate this.

First, you will create a new JSON file called toolbox.json. In there, you can start by defining the API version, kind of object and metadata to be used.

```json
{
 "apiVersion": "v1",
 "kind": "Pod",
 "metadata": {
   "name": "toolbox"
 },
```

Now you can specify the container to use. Containers can come from multiple registries. In this case, we will pull the image from the Red Hat registry. This is an official image that has been tested and vouched for by the Red Hat engineering team.

```json
  "spec": {
    "containers": [
      {
        "name": "toolbox",
        "image": "registry.access.redhat.com/ubi8/ubi",
```

Next, you will need to specify the command that will be ran as soon as the container is started. Once this process stops, the container will stop and the pod will restart. Because you will want this pod to live forever, you will need to create a process that has an infinite loop. This can be achieved in a bash script.

```bash
while true;
  do sleep 30;
done;
```

This process will sleep for 30 seconds, wake up to finish the loop and start again. This will keep the container up and running. To add this command to the container, you will use the command bash, followed by two dashes. Every argument after that is a bash script that will be executed when the container starts. Make sure to close all of your blocks.

```json
        "command": ["/bin/bash", "-c", "--"],
        "args": ["while true; do sleep 30; done;"]
      }
    ]
  }
}
```

Your full toolbox.json file should look like this.

```json
{
  "apiVersion": "v1",
  "kind": "Pod",
  "metadata": {
    "name": "toolbox"
  },
  "spec": {
    "containers": [
      {
        "name": "toolbox",
        "image": "registry.access.redhat.com/ubi8/ubi",
        "command": ["/bin/bash", "-c", "--"],
        "args": ["while true; do sleep 30; done;"]
      }
    ]
  }
}
```

You can now apply this file to add the pod to your cluster.

```bash
kubectl apply -f ./toolbox.json
```

Once this is done, you will have a pod called toolbox that you can access to use various Linux commands inside your cluster. Once you open a bash session, you will be able to interact with this container and you can use the exit command to close your session.

```bash
kubectl exec -it toolbox -- bash
exit
```

This will be useful later on to contact various pods and services inside your cluster. 

## Lesson 14 - Create the front-end deployment

In the previous lessons, you’ve seen how to use pods in Kubernetes and how they relate to containers. While it is technically possible to manually create pods, you would normally have another object that would create those for you. When you have a server, you would typically use a Deployment to create and manage the pods that will contain the various components of your architecture. This is what we will do in this lesson.

One of the main reasons to use Kubernetes in the first place is how easy it is to scale up your applications. When you have a containerized application, this can be achieved by adding more containers to respond to the peaks in demand for your web application. This is done because pods are meant to be ephemeral. They can easily be brought up or down. Because they don’t keep the state of the request, it doesn’t matter which pod your clients will hit, the response will always be the same. 

In order to create multiple pods that can answer those requests, you will use a Deployment. A Deployment is a Kubernetes object that describes the desired state of an application. When you add a deployment to your cluster, it will create a ReplicaSet behind the scenes which will watch and ensure that you always have the desired number of pods that you requested in your deployment. 

To create your first deployment, you will use a YAML file with a structure similar to the one we used to create the pods. First, create a file called deployment.yaml. In there, start with the api version and the kind of object, which is a deployment in this case.

```yaml
apiVersion: apps/v1
kind: Deployment
```

Next, you will add some metadata. In this case, you will only specify a name for your deployment. You can call it hello.

```yaml
metadata:
  name: hello
```

You are now ready to write the spec section of the YAML file. This is where you will describe how you would like your application to behave. For this first example you will run multiple empty Nginx servers. 

The first step will be to specify a template for the containers you want to run as part of this deployment. You will use the template property to describe those. This template will describe a pod very similar to the one you created in the last lesson.

```yaml
spec:
  template: 
```

The template for this pod will have a metadata property. This time, we won’t add a name for our pod. The Deployment and ReplicaSet will find a unique name for our pod as they get created. You will need to add labels though. Kubernetes objects rely heavily on labels to identify and find them. Labels can be anything you’d like. In this case, you can use the label app and give it the hello-demo value.

```yaml
    metadata:
      labels:
        app: hello-demo
```

Next, you need a spec section for this pod. This is where you will specify the name and the image to be used for the containers in those pods. In this case, you can name the container server and use the nginx base image.

```yaml
    spec:
      containers:
      - name: server
        image: nginx:1.17
```

This will create a pod using the nginx base image, and this pod will have a label called app with the value of hello-demo.

Now back to your deployment. You’ve described the template for the pods to be used by the deployment, and now you will need to describe how many of these pods you want. In the spec section of your deployment, you can add a selector property. This will tell the deployment how to find the matching pods. This is where you will use the labels of the pods.

```yaml
  selector: 
    matchLabels:
      app: hello-demo
```

Now that your deployment knows how to create the pods needed and know how to find the pods related to this deployment, you can specify how many replicas of this pod you would like.

```yaml
  replicas: 2
```

Your final deployment.yaml file should now look like this.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
spec:
  template:
    metadata:
      labels:
        app: hello-demo
    spec:
      containers:
      - name: server
        image: nginx:1.17
  selector:
    matchLabels:
      app: hello-demo
  replicas: 2
```

You are now ready to apply your first deployment in your cluster. You can use the same command as you did to deploy your pods. And run a get all command to see what you now have in your cluster.

```bash
kubectl apply -f ./deployment.yaml
kubectl get all
```

You should now see that you have the Kubernetes API service, one deployment, one replica set as well as two more pods. When you applied this file, Kubernetes created the deployment and replica set. Then, the replica set launched those two pods to match the desired application state. Let’s take a closer look at our pods. You can use the get command to only get a specific resource.

```bash
kubectl get pods
```

This should list the two pods that are now running as well as your toolbox if you created it earlier. Note how each of the pods has a unique name. These were generated by the deployment. If you want to log inside a pod as you did previously, you will need to get the name of the pod from that list and then use this pod name with the exec command from kubectl. Once inside the container, you can validate that it has a running nginx instance using the same command you used in the previous lesson.

```bash
kubectl exec -it <podname - hello-d7f4d45c5-6bf9x> -- /bin/bash
service nginx status
exit
```

Now imagine you are expecting a sudden burst of traffic and you would like to add more servers to handle this load. You can use the scale command to add as many replicas as you need to a given deployment. This is the equivalent of changing the value of the replicas property in the deployment YAML file.

```bash
kubectl get pods
kubectl scale deployment/hello --replicas=10
kubectl get pods
```

You should now see a list of ten pods that are either running or in a ContainerCreating state. If you need to scale down back a little to save on your resources, you can change it again with the same command.

```bash
kubectl scale deployment/hello --replicas=4
kubectl get pods
```

You can now see six pods being terminated. If you want a few seconds and run the get pods command again, there should be only four pods left. Now, imagine one of your pods fails and crashes. You can simulate this by deleting one of the existing pods. To do so, find the name of a unique pod and run the delete command for it. Immediately after, run list all the pods again.

```bash
kubectl delete pod <pod name>
kubectl get pods
```

You should still have four pods up and running but one of them will have an age of just a few seconds. The pod you deleted is not listed anymore. As soon as the replica set noticed that one pod was missing, it started a new one. You will notice that this new pod has a different and unique name. 

Now that you know what deployments are and how they work, you are ready to deploy your front-end in this cluster. First, start by cleaning up everything you added so far with a delete all. You will need to add a --all argument as well. Now running a get all should only list the Kubernetes service again. This will delete everything you created so far so you might want to apply the toolbox.json file again to restart your Toolbox pod.

```bash
kubectl delete all --all
kubectl apply -f ./toolbox.json
```

Back to the deployment.yaml file now, you will need to do a few changes. First, you can change the name of this deployment to k8scourse-front. You can also add some labels which will make it easier to find this deployment once we start having multiple objects in the cluster. You can add a label for the app called k8scourse-demo and a label for the role which you can give the frontend value. This will make it easier to list everything that is either related to this application or specific to the front-end.

```yaml
  name: k8scourse-front
  labels:
    app: k8scourse-demo
    role: frontend
```

The template for the pods will also need to be changed. In the metadata section, you can change the value of the app label to k8scourse-demo and add another label for the role: frontend.

```yaml
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: frontend
```

In the spec of your template, you will also need to change the image to be used. You won’t be using an empty nginx server anymore, you will use the image that you created in the previous lessons that contain the nginx server with all the code for your application.

```yaml
      containers:
        ...
        image: <user name>/k8scourse-front
```

Finally, in the selector section of the deployment, make sure that change the matchLabels to the new role: frontend. This deployment will only match pods for the front end. If you kept the matching labels with the name of the application, this would cause problems in the future as you add more and more deployments.

```yaml
    matchLabels:
      role: frontend
```

Your final deployment.yaml file should look like this.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8scourse-front
  labels:
    app: k8scourse-demo
    role: frontend
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: frontend
    spec:
      containers:
      - name: server
        image: joellord/k8scourse-front
  selector:
    matchLabels:
      role: frontend
  replicas: 2
```

You are now ready to apply this file to your cluster and see what you now have running in this cluster.

```bash
kubectl apply -f ./deployment.yaml
kubectl get all
```

You now have two pods running your application. Unfortunately, there is no way to contact those pods yet. There is no way to do a curl to test those pods. They haven’t been exposed to the outside world yet and this is what you will do in the next lesson.

## Lesson 15 - Create the front end service

In the last lesson, you create a deployment which in turn created a couple of pods running your containers. Because the pods are meant to be easily started or stopped, it is hard to keep track of those random names they were given. This is where the Service object will help you.

A Kubernetes Service is an object that helps you find a set of pods. It will take care of the networking for you. From a service, you will be able to map ports and to do load balancing between the different pods that you have running. This is why scaling is easier to do with Kubernetes. You can change the number of pods that you have running at any given time and as long as you have a service to expose those pods, everything will be handled automatically for you.

A service will also give your pods an internal IP address and DNS entry so that they can be reached from other pods inside your cluster.

In the previous lesson, you already created a deployment and you are ready to expose them through a Kubernetes Service. Just like the other objects you’ve built so far, this one will also take an apiVersion, a kind and some metadata. Start by creating a service.yaml file and add these.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8scourse-front
  labels: 
    role: frontend
```

Next, you need to specify which pods will be associated with this service. Just like you did with your deployment, you can use a label to select those pods. When using kubectl get, you can use the -l command. This will list the objects that are associated with a specific label. This can be useful if you want to test out your selector first.

```bash
kubectl get pods -l role=frontend
```

Once you are happy with your selector, you can start working on the spec section of the service. By default, this service will be a load balance and will distribute the loads between a number of pods based on the labels you specified.

```yaml
spec:
  selector:
    role: frontend
```

Finally, you will need to add a port mapping. This is similar to the way it was done with your container. In this case, the port is the port that will be used to access the service and the targetPort is the port on which the pods are serving content. 

```yaml
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

Your completed service.yaml file should look like this.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8scourse-front
  labels: 
    role: frontend
spec:
  selector:
    role: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

This service can now be applied to your cluster using the apply command.

```bash
kubectl apply -f ./service.yaml
```

If you do a get to list the current services, you will see this new k8scourse service that you just created. You will also see the port that is uses as well as an internal ip address. This address can also be found inside any pod in the cluster as these values will be injected in the pods as environment variables. You can see this by first deleting all of your pods. You can also use a -l argument here to select only the pods with a specific label. Because you have a deployment in place already, Kubernetes will automatically restart two of them to replace those you deleted. Now list the pods to see their names and run the printenv on one of the pods with the exec command. This Linux command prints out all the environment variables.

```bash
kubectl delete pods -l role=frontend
kubectl get pods
kubectl exec <pod name> -- printenv
```

You should see a VALUE for K8SCOURSE_SERVICE_HOST. This is the internal IP address of your service. If you curl this IP address, your request will time out. This is because this address only exists from within the cluster.

If you have your toolbox pod running, you will also need to restart it so that it has access to the environment variables. There is now restart functionality on pods in Kubernetes so you will need to terminate the pod by deleting it and then restart it using the apply command. 

```bash
kubectl delete pod toolbox
kubectl apply -f ./toolbox.json
```

Once your Toolbox pod is started, you can open a session on it and curl your front end. This will serve you the content from the application. 

```bash
kubectl exec -it toolbox -- /bin/bash
curl $K8SCOURSE_SERVICE_HOST:$K8SCOURSE_SERVICE_PORT
```

Because there is an internal DNS, you can also access the service by using the name you gave it in the YAML file. Doing a curl on k8scourse-front should give you the same result. You can then exit this pod.

```bash
curl k8scourse-front
exit
```

There you have it. Your service now lets you connect to your pods. The only issue right now is that you have to be inside your cluster in order to communicate with the internal pods. In order to expose your front end to the rest of the world, you will need another Kubernetes object called the Ingress. 

## Lesson 16 - Expose Your Application To The Outside World

Now that you have your application running inside the cluster, you will want your users to be able to connect to it. In order to expose your service to the public internet, you will need a new Kubernetes object called an Ingress. This Ingress will be in charge of monitor any incoming requests to your cluster and redirect the traffic to the various services based on the host or the path that was requested. 

An ingress will be able to route traffic based on many criteria. In this application, as we add more services, we will use path-based routing. This means that the ingress will check what is the path of the route and redirect to the appropriate service. More specifically, any incoming request to /api will be forwarded to the API service which will then routed to the various pods.

Since you only have one service for now, you will start with a simple Ingress that will redirect all the traffic to your front end.

Just like any other Kubernetes object, this YAML file will start with an api version, a kind of object and some metadata. In a file called ingress.yaml, start with the version number. At the time of writing this course (July 2020), ingresses were still in beta and is available as part of the networking.k8s.io package. the kind of object will be an Ingress. For the metadata, you can add a name here, you can use "main" for this ingress.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: main
```

For the spec part of the ingress, you will add a single backend. Backends are essentially services that you will redirect traffic to. For now, you only have the front end application that is exposed through a service so no need to create complex rules. You can simply state what is the name of the service and on which port it is serving.

```yaml
spec:
  backend:
    serviceName: k8scourse-front
    servicePort: 80
```

Your final ingress.yaml file should look like this.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: main
spec:
  backend:
    serviceName: k8scourse-front
    servicePort: 80
```

You are now ready to apply this ingress to your Kubernetes cluster. This will be done with the kubectl tool again, using the apply command.

```bash
kubectl apply -f ./ingress.yaml
```

Now that your ingress is part of your cluster, you’ve just exposed your front end to the outside world. To test this, you will need the address of your server and you will be able to curl this address. If you are using minikube or CRC, you can use the ip command to get the IP address that will point to your cluster.

```bash
#cloud
curl my-kubernetes-cluster.cloud.tld
#minikube
curl $(minikube ip)
#crc
curl $(crc ip)
```

With a curl, you should see a message telling you to enable JavaScript. If you really want to test out the application, you can use a browser instead of curl and open the ip address or URL of your Kubernetes cluster.

Your application is now available to the rest of the world. But so far, you’ve only been working on the front-end. In the next section, you will see how to do the same with your backend.
Lesson 17 - Kubernetize Your Backend
In the last lessons, you have created a Deployment and a Service for your front-end. Now, you are ready to do the same for your back-end. The process for the back-end is almost identical to the front-end. You will create a deployment with the appropriate labels. Ask Kubernetes to have one replica of your application running at all times. And then you will create a Service so that the pods to your backend can be located and eventually accessed from the outside world.

The first thing you will do is to create a new YAML file that will contain both the deployment and service. You can name this file backend.yaml. In this file, you can start with the api version, kind of object and metadata for the deployment. As part of the metadata, you will use labels to specify that this will be the deployment for the backend component of your application.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8scourse-back
  labels:
    app: k8scourse-demo
    role: backend
```

Now, in the spec section, you will fill in the template for the container that will be used for the back end. This section will be very similar to what was done for the front end but the image will be different.

```yaml
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: backend
    spec:
      containers:
      - name: api
        image: joellord/k8scourse-back
```

Finally, you will add the selector for the pods as well as the number of replicas for this deployment. For now, you will only have one replica of the backend running at any given time.

```yaml
  selector:
    matchLabels:
      role: backend
  replicas: 1
```

You can create more than one object in a Kubernetes YAML file. You do this by separating the various objects with three dashes. After, those, you can create the associated service by starting with the API version, the kind of object and metadata. In this case, you will call this service the k8scourse-back service and it will have a label to match it to the backend.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8scourse-back
  labels:
    role: backend
```

Next, in the spec section, you will specify the selector for the pods, this will be based on the label for role backend. Your back end application will be exposed internally on port 80 and the service will redirect the traffic to port 3000 inside the matching pods.

```yaml
spec:
  selector:
    role: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

Your full backend.yaml file which contains both the deployment and the service should look like this.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8scourse-back
  labels:
    app: k8scourse-demo
    role: backend
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: backend
    spec:
      containers:
      - name: api
        image: joellord/k8scourse-back
  selector:
    matchLabels:
      role: backend
  replicas: 1
---
apiVersion: v1
kind: Service
metadata:
  name: k8scourse-back
  labels:
    role: backend
spec:
  selector:
    role: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

You are now ready to apply this file to your cluster with the kubectl tool. If you run a get all command now, you should see a few more objects to the list that is displayed.

```bash
kubectl apply -f ./backend.yaml
kubectl get all
```

You can also use your toolbox pod to test out the back end service. Use the exec command on that pod and open a bash session. Once inside the container, you will be able to curl the k8scourse-back service. This NodeJs has a /health route that you can use to see if the server is up and running. You will get an error since you don’t have a database but you can at least confirm that the service is being reached.

```bash
kubectl exec -it toolbox -- /bin/bash
curl k8scourse-back/health
exit
```

You can see that the service is working and reaching the pod that is serving your back end. If you try the front end though, it still can’t connect to the API. That’s because you will need to make this service publicly available for the front end to be able to connect to it.

## Lesson 18 - Use paths to expose multiple services

In the last lesson, you created the deployment and service required for the back end to run. This works well but this API needs to be exposed externally for the front end to be able to connect to it. This is because the HTTP requests from your application are coming from inside the browser running on your user’s system and not from within the cluster itself. To make the API available, you will use the same ingress you had previously but you will now add multiple paths for the various services that you want to expose.

To do that routing, you will decompose the path of the request in multiple parts using regular expressions. Then, you will use a series of rules in your Ingress spec to indicate to which service should the traffic be routed.

First you will keep the first four lines of your original ingress. The rest can be deleted for now.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: main
```

Let’s now move on to the spec section. Instead of having a single backend here, you will have a rules object. This object will have some HTTP rules around paths. In here, you will be able to put in an array of backends.

```yaml
spec:
  rules:
  - http:
      paths:
      - backend:
```

The rules will be applied in the order in which they are specified in the YAML file. To leverage that, the first rule will look to see if the path starts with /api. If not, then it will fall to the last rule which will match any other route.

The first backend will map to the k8scourse-back service, and to the port 80. Next, you can write the regular expression that will match a path that starts with /api, followed by a backslash and a wildcard for the rest of the path. The sets of parentheses will come in handy later on. Finally, the match will be done on a URL path prefix split by / so you can add the property pathType to Prefix.

```yaml
        - backend:
            serviceName: k8scourse-back
            servicePort: 80
          path: /api(/|$)(.*)
          pathType: Prefix
```

Now, the next backend will match all the other requests that don’t start with the prefix /api. It will then map to the service k8scourse-front and to the port 80. Note that the path has an empty set of parentheses. This is to match the regular expression of the first backend. By adding this empty set, we will use the content of the second match in each regular expression with the service.

```yaml
        - backend:
            serviceName: k8scourse-front
            servicePort: 80
          path: /()(.*)
```

Now that our two backends are defined, any traffic coming to /api/foo will be redirected to the k8scourse-back service. Any other request, like /foo/bar, would be redirected to the front-service. This will cause a small problem though. Our NodeJs express server defines the routes from the base path. Meaning that the route /health will work but the route /api/health does not exist in our server. This is where our special regular expressions will come in handy.

Back to the metadata section of the ingress, you will need to add a rewrite rule. You will add an annotation of type rewrite-target. Then, you will tell the ingress to rewrite this URL as the second element of the matching regular expression.

```yaml
metadata:
  ...
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
```

Using this rule, a call to /api/health will be redirected to k8scourse-back/health. Because we have an empty set of parentheses on the second rule, it will match the full path. Meaning that a call to /foo/bar will stay intact and be redirected to k8scourse-front/foo/bar.

Your final ingress.yaml file should now look like this.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: main
  annotations:
   nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - http:
      paths:
        - backend:
            serviceName: k8scourse-back
            servicePort: 80
          path: /api(/|$)(.*)
          pathType: Prefix
        - backend:
            serviceName: k8scourse-front
            servicePort: 80
          path: /()(.*)
```

You can now apply this new ingress file. No need to delete the existing ingress, Kubernetes will recognize the name and apply the changes. You can also test the new ingress by doing curl requests to the front end and to the /health route of the api.

```bash
kubectl apply -f ./ingress.yaml
curl <path-to-kubernetes>
curl <path-to-kubernetes>/api/health
```

If you try the application in your browser, you should see the front end but the calls to the API still won’t work. You can open the network tab of your developer tools and you will see that the requests are still going to the wrong address. To fix this, you will need to update your front end environment variable to use this new base URL.

## Lesson 19 - Change Environment Variables For A Deployment

You almost have a fully working application but now the routes to the API server have changed for your Kubernetes deployment. Thankfully, in one of the earlier lessons, you stored this variable so that it could be stored inside an environment variable. Also, your server will now look for environment variables and update the config.js file accordingly. This should let you easily change the URL for the API server location.

In your deployment.yaml file, in the containers section, you will add a new env property. This will contain an array with all the environment variables that you want to add to the container that runs in this pod. Environment variables are objects with a name and value properties.

```yaml
spec:
  template:
    ...
    spec:
      containers:
      - name: server
        ...
        env:
        - name: BASE_URL
          value: api
```

Your new deployment.yaml file should now include the environment variable and look like this.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8scourse-front
  labels:
    app: k8scourse-demo
    role: frontend
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: frontend
    spec:
      containers:
      - name: server
        image: joellord/k8scourse-front
        env:
        - name: BASE_URL
          value: api
  selector:
    matchLabels:
      role: frontend
  replicas: 2
```

Now you will need to apply the changes to this deployment and restart the pods. You can apply the new deployment with the apply command again. This will update the deployment and will automatically restart the pods since it will detect that those need to be changed. If you do a get command to find all the front end pods, you should see that they’ve been recently restarted.

```bash
kubectl apply -f ./deployment.yaml 
kubectl get pods -l role=frontend
```

Now go back to the application in the browser and you will see it running again. Well, almost. You still haven’t connected a database yet but you’re getting closer.

## Lesson 20 - Persist Data And Volumes

You’re getting closer to have your application running again. Both the front end and the back end are now running. The only missing part of the database. In your local environment, you used a base image for MySQL and that worked well. But if you remember carefully, each time you stopped the container, all the data was also gone. This is due to the ephemeral nature of containers.

To help with this, you will need to use new Kubernetes objects called Persistent Volumes and Persistent Volume Claims. The Persistent Volume Claim (or PVC) is where you will store your data. I order to use a PVC, you will first need to ensure that the storage space was made available by your cluster administrator. This storage space that was made available is called a Persistent Volume (or PV). 

There are many ways to provision these persistent volumes. First, an administrator can manually create a number of persistent volumes. Those are called statically provisioned. This requires administrator access to the cluster. If you are using minikube or crc, you should have the necessary permissions to create a PV. 

If you are using a cloud-based Kubernetes distribution and don’t have the rights to provision Persistent Volumes, you will need to use dynamically provisioned PVs specifically for the PVC you are creating. In this case, you won’t need to create a Persistent Volume but you will need to add a storageClassName to your PVC definition. This will tell the cluster that you are requesting a dynamically provisioned PV that will match your PVC. You will need to refer to the documentation of your cloud provider for this as each provider has their own classes.

For now, you can start by creating both your PV and PVC in a single YAML file called mysql-volume.yaml. These new objects follow the same structure as the previous ones that you created. Starting with the Persistent Volume, you can put in the api version, object kind and metadata properties. In the metadata, you can add the name mysql-pv.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv
```

Next, you will specify the spec of this new object. First, this persistent volume, you will make a 1 gigabyte space available for your cluster. You can specify this in the storage property, under capacity. You will also need to specify all the access modes that this persistent volume will support. There are three access modes possible. The first one is ReadOnlyMany. This is for a persistent volume that would be mounted in read mode only. The other two, ReadWriteOnce and ReadWriteMany will provide you with read and write access. The Once or Many properties refers to how many nodes can have access to it. Because this PV is for single-node clusters (minikube or crc), you can use the ReadWriteOnce access mode. Finally, because this is on a single node cluster, you will need to specify the host path. This is where the volume will be mounted in the node. This property is not used when using a multi-node cluster as you would normally do in the cloud. This PV will be located in the /mnt/data folder of our node.

```yaml
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

This is all that is needed for the persistent volume. Keep in mind that this is for a single node system like minikube or crc. If you are using a cloud-based setup, the PVs will either be made available to you by an administrator or will be dynamically provisioned by using the storage class property of the PVC.

Now that you have a persistent volume in your cluster, you will be able to claim to space for your pods by using a persistent volume claim. This new object will start just like all other Kubernetes object, with an api version, a kind property and some metadata. In this case, it will be an object of kind PersistentVolumeClaim and you can give it the name mysql-pvc.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
```

The spec part of this object will specify the properties that we expect for our volume. In this case, we will need a persistent volume that has a ReadWriteOnce access mode and at least one gigabyte of available disk space. This storage requirement is a minimum. If the cluster only had PVs with 2 gigabytes available, this is what you would have for this PVC. On the other hand, if we requested for a 2Gi storage minimum and the cluster only had 1Gi persistent volumes, this wouldn’t work.

```yaml
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Once again, this will work on either minikube or code ready containers. If you have a cloud-based provider for your Kubernetes cluster, you will need to look up their documentation to find out how to create a persistent volume claim. Typically, you would only have a persistent volume claim similar to the one you just created but it would also have a storageClassName property that would allow for dynamically provisioned persistent volumes. 

You mysql-pv.yaml file with the definition of both the persistent volume and the persistent volume claim for a single node cluster should now look like this.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce 
  hostPath:
    path: "/mnt/data"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

You can now apply this file to your cluster and see the newly created resources. You can use the get command with objects separated by commas to see multiple types at once.

```bash
kubectl apply -f ./mysql-pv.yaml
kubectl get pv,pvc
```

You should see the newly created persistent volume and persistent volume claim. If you use a cloud-based provider, you might only have a persistent volume claim here. Now that you have created your PVC and claimed some disk space, you are ready to use this with a deployment so that you database will be able to keep the data even if the pod itself crashes or gets restarted.

## Lesson 21 - Deploy Your Database

Now that you have some disk space available, you are ready to create the deployment and service for your database. These are very similar to what you have done already for the front end and the back end. First, for the deployment, you can start with a new file called mysql.yaml. It will contain the usual api version, kind and metadata.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
```

Next, for the spec, you will write a selector to match pods that have a label role = db. Then, you will be ready to write the template for your pods. These pods will have the usual metadata. They will have two labels, one for the app name which is k8scourse and another one for the role, this is db and is the one used by your selector.

```yaml
spec:
  selector:
    matchLabels:
      role: db
  template:
    metadata:
      labels:
        app: k8scourse
        role: db
```

Next, in the spec section of the pod template, you will add the required container for this pod as well as the volumes that you will mount inside that container.

```yaml
    spec:
      containers:
        ...
      volumes:
       ...
```

First, you can start with the container. This container will use the mysql:5.7 base image and will require a few environment variables. You can name this container mysql. Thes environment variables are the same that were used when this container was used with docker. You will also need to add the ports for this container. In this case, MySQL runs on port 3306 by default so you can keep that value.

```yaml
      containers:
      - image: mysql:5.7
        name: mysql
        env:
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASSWORD
          value: mysql
        - name: MYSQL_ROOT_PASSWORD
          value: root
        ports:
        - containerPort: 3306
```

You will also need to mount your volume here but first, you will need to add your persistent volume claim to the pod so that it can be mounted in the container. In the volumes section of the template spec property, you will need to give a name to this volume. You can call it mysql-storage. Then, you will need to specify with persistent volume claim will be used for this volume, in this case, it’s the mysql-pvc one that we just created.

```yaml
spec:
  ...
  template:
    spec:
      containers:
        ...
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
```

Now, you can go back to the container spec and add the volume mount to the container template. First, add a volumeMounts array to the containers section. Then add the name of the volume to be mounted. This is the name of the volume you just added in the volumes section, mysql-storage. Then, you will specify where this volume should be mounted. In this case, you will mount it to the /var/lib/mysql folder which is the folder that is used to store all the MySQL data.

```yaml
  template:
    spec:
      containers:
        ...
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
```

This deployment will now create a pod with the MySQL base image container and a persistent volume claim linked to it. If you restart this pod, all of your data will be persisted. 

In order for your other services to be able to connect to this pod, you will also need to create a service. This Kubernetes object will use API version v1, will be of kind Service and will have the name mysql.

```yaml
apiVersion: v1
kind: Service
metadata: 
  name: mysql
```

This service will map the port 3306 from the pods, which is the exposed port from your containers. It will also route traffic to pods that have the label role set to db.

```yaml
spec:
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
  selector:
    role: db
```

Your completed mysql.yaml file should contain both your deployment and your service and should look like this.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  ports:
  - port: 3306
  selector:
    role: db
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      role: db
  template:
    metadata:
      labels:
        app: k8scourse
        role: db
    spec:
      containers:
      - image: mysql:5.7
        name: mysql
        env:
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASSWORD
          value: mysql
        - name: MYSQL_ROOT_PASSWORD
          value: root
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
```

You can now apply this file to the cluster to start your pod containing the database. Once this file has been applied, you can get the pod that runs the MySQL database and login it to test out the database. Once inside the cluster, you can use the mysql command to enter the database terminal. Use the -u and -p parameters to specify the user name and password that were provided in the environment variables. In this case, the credentials will be user for the user name and mysql for the password. Once you are in the database terminal, you can use the SHOW DATABASES command to list the databases that are available. Don’t forget the semi-colon after the SQL query. You should see a single database called information_schema.

```bash
kubectl apply -f ./mysql.yaml
kubectl get pods -l section=db
kubectl exec -it <mysql-pod-name> -- /bin/bash
mysql -uuser -pmysql
SHOW DATABASES;
exit
exit
```

You can exit the MySQL terminal with exit and disconnect your bash session with the pod with the exit command.

Your database is now up and running and is almost ready to be used by the back end service. You just need to initialize your database with the seed data that you previously had and then connect the back end to the database.

## Lesson 22 - Seed the Database And Connect The Backend

Now that you have a running database, you will need to initialize it with the initial data set. You can use Kubernetes to start new containers on the go and remove them afterwards. This is what you will do here to create a MySQL client that will connect to your database.

First, start with the run command. You will use the -it flags to run this container in interactive mode. Then, use the --rm flag. This is similar to when you used it with docker. It will remove the pod once this command is completed. Next, specify the image you want to use, in this case, you will use the mysql:5.7 base image. Next, tell Kubernetes not to restart this pod after completion with the --restart parameter. Finally, you can give a name to this pod, mysql-client in this case. This pod’s MySQL server won’t be used, you will only run this pod to have access to the client. For this ready, you can add an environment variable so that MySQL picks a random root password for you.

```bash
kubectl run --image=mysql:5.7 --restart=Never --env="MYSQL_RANDOM_ROOT_PASSWORD=true" mysql-client
```

Now that you have a pod with a MySQL client up and running, you can copy a file from your file system into that specific pod. To do so, you can use the cp command. Using that command, you can copy files to or from the pod. In this case, you will take the init.sql from your local filesystem and copy it into the mysql-client pod filesystem. You can copy that file into the /tmp folder of the pod. Once the file is copied, you can open a session in the pod with the exec command and you should be able to see that file.

```bash
kubectl cp ../db/init.sql mysql-client:/tmp/init.sql
kubectl exec -it mysql-client -- /bin/bash
ls /tmp
```

Now, still from your bash session in the mysql-client pod, you can use the mysql cli tool to access your MySQL server running in your cluster. This can be done by using the name of the service to locate the associated pods. 

Start with the mysql executable and use the parameter -h to specify the host. The host, in this case, is the name of the service that points to your MySQL server, which is mysql. Next, you will need root access to execute the init.sql script. The root access is needed in order to create a database and to give the non-root user all the privileges needed to read and write to this database. The root password was specified as part of the environment variables in the MySQL deployment file. If you followed the instructions, the root password should be root. Finally, you can specify a file to be executed on this host with this user. The file in question will be the init.sql file that you just copied over.

```bash
mysql -hmysql -uroot -proot < /tmp/init.sql
```

This will run this SQL script against your existing MySQL server. In the previous lessons, you used the docker entry point and copied the file over. This worked well when you started a new pod every time and didn’t care about persisting your data. Now that you are moving into a production server, the structure of your database might need to be changed from time to time but you don’t want to start with a blank database every time. This is why you are importing this file manually once.

Now that your database is populated, you can exit the terminal with the exit command. You can also delete this pod as you won’t need it anymore.

```bash
exit
kubectl delete pod mysql-client
```

If you want to test your database setup, you can delete the pod that contains the mysql server. Your deployment will automatically create a new one and link it to the volume as specified in the pod template. You can then start a mysql-client instance again. This time, you will use the --rm flag. This will remove the pod automatically once you are done with the mysql terminal. It is a convenient way to create pods and automatically clean them up once you are done.

Once you’re inside that terminal, you can switch to the images database and then perform a select query to get all the records from the images table. If the persistent volume claim is configured correctly, you should see a record with the caption Hello.

```bash
kubectl delete pods -l role=db
kubectl run -it --rm --image=mysql:5.7 --restart=Never mysql-client -- mysql -hmysql -uuser -pmysql
```
```sql
use images;
select * from images;
```
```bash
exit
```

Your database is now populated and ready to be used by your backend. In order to connect your backend to the database, you will need to add environment variables so that your server knows how to find the MySQL database.

To do so, you can open up the backend.yaml file you created earlier. From here, in the containers section of the template for your deployment, add the environment variables that are needed by the back end.

```yaml
spec:
  template:
    ...
    spec:
      containers:
        ...
        env:
        - name: MYSQL_HOST
          value: mysql
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASS
          value: mysql
```

You can now apply this new deployment to your cluster with the apply command. Notice how the deployment shows as configured while the service shows as unchanged. Kubernetes will validate if there are any changes and won’t restart the service if it doesn’t have to.

```bash
kubectl apply -f ./backend.yaml
```

Because there was a change in the deployment, Kubernetes will immediately start a new pod for the backend and once it is running, it will delete the old one. This is done in such a way that your users won’t notice a downtime.

Everything is now up and running in your cluster. You have a front-end running on an nginx server which will serve the UI to your users. There is a NodeJS backend that processes the requests from your UI. And finally, you now have a database that will persist data. You can now open up your browser and point it to your Kubernetes cluster. From there, you can now access the full application. If you have a sudden burst of traffic, you can also easily increase the number of pods that are running and decrease them afterwards using the scale command. Finally, if any of your pods crashes, Kubernetes will self heal and automatically restart those for you.

## Lesson 23 - Unmonolithize Your Backend

Everything is now up and running. You have your front end, your back end and a database. Everything can be scaled up easily if needed and everything will be monitored and will stay up and running. There is only one issue left with this application. At the moment, the back end is one large monolith. Well, a small monolith. The problem here is that whenever an image is being captioned, it takes up a lot of processing power and the server is blocked for a few seconds. 

Because we have a Kubernetes cluster, it would be possible to scale horizontally by adding multiple pods, but that would also increase the number of NodeJS servers running which is not necessary. A better solution would be to break down this monolith in smaller pieces. The CPU hungry process could be running on its own and the NodeJS server could make calls to it. This way, it would be possible to add multiple pods of the captionizer server without adding the overhead of the NodeJS server.

To do so, you will need to extract the relevant code and put that in its own container. Then, you will need to create a deployment and a service for this new image. Then, you will need to create a persistent volume and persistent volume claims to store those images on a shared disk space.

For convenience, the two services have already been broken up for you. You can see the new files in the /services folder of the project you cloned from the git repository. Essentially, the addCaptionToImage function was removed from the index.js file and moved into the new gif-captionizer/index.js file. Then, a single route was added to the gif-captionizer that will take a filename and a caption. It will convert the image and return a 200 status code. Because both services will share the same volume, there is no need to share the actual image, it will already be available for the backend service.

You are now ready to build your two images. For the back end service, you can start from the root folder and clone the /back folder into a new /microback folder. Next, copy the files from the /services/back folder into this new microback folder. This will overwrite the package.json and the index.js files. Everything else will stay the same. This new micro back end service will use the same Dockerfile that you previously had for the monolithic back end.

```bash
cp -r back microback
cp ./services/back/* ./microback
```

Next, you will need to edit the microback/config.js file to use environment variables for the image folder and the name of the service that will add the captions to the images. As you break down your application in smaller pieces, you will most likely need more and more environment variables to identify the various services and paths to be used by the application.

```javascript
const config = {
  ...
  IMAGE_PATH: process.env.IMAGE_PATH || "/tmp",
  GIF_CAPTION_SVC: process.env.GIF_CAPTION_SVC || "localhost:4000"
}
```

Now that all the files have been moved, you are ready to build this image. You can tag this image k8scourse-microback. Once the build is ready, you can push this image to your registry.

```bash
cd microback
docker build -t joellord/k8scourse-microback .
docker push joellord/k8scourse-microback
```

Next up, you will need to create an image for your gif-captionizer service. Starting from the root directory of your project, create a microgifcap folder. In there, you can copy the files from the /services/gif-captionizer folder. This will copy all the source code for this new microservice with the package.json. If you look at the files in this new folder, you should see two JavaScript files and a package.json.

```bash
cd ..
mkdir microgifcap
cp ./services/gif-captionizer/* ./microgifcap
cd microgifcap
ls
```

You can now create a new Dockerfile in this folder. This Dockerfile will be similar to the one that was used for the back end. First, you will start with a FROM statement and you will use the Node:14 image as a base. Then, you will create the /app folder and change the permissions so that the node user can access this folder. Once this is done, you can change the working directory to /app

```docker
FROM node:14
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
```

You can then switch the user to be used by this image to the user node. This will ensure that this container is not running as root.

```docker
USER node
```

Next, copy the package.json file, run the npm install command, copy the rest of the JavaScript files and specify the command to be executed once the container is ready with the CMD statement.

```docker
COPY ./package*.json /app/
RUN npm install
COPY ./*.js /app/
CMD ["node", "/app"]
```

Once your Dockerfile is ready, you can proceed with building this new image and push it to your registry.

```bash
docker build -t joellord/k8scourse-microgifcap .
docker push joellord/k8scourse-microgifcap
cd ..
```

Your two new images are now pushed into the cloud and are ready to be used by your Kubernetes cluster. In order to deploy these microservices to the cloud, you will need to create a deployment for each application, a service for each one, a shared PV and a shared PVC. All of this will be in a file called microservices.yaml.

First, you can start with your Persistent Volume. This persistent volume will be similar to the one that you created for your MySQL data with the exception of the name that will change to micro-pv.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: micro-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

You then need to add a Persistent Volume Claim. This PVC will claim the PV you just created. Start by separating the two with three dashes to tell Kubernetes that this is a new object. Then, you can create a PersistentVolumeClaim based on the MySQL one with the exception of the name that will change to micro-pvc. This is because you are currently running a small Kubernetes distribution that only has a node. Should you have a larger cluster, you might need to use the ReadWriteMany accessMode for your PVC.

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: micro-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Next up is your deployments. You can start with the new micro back end. Starting with an object from the apiVersion apps/v1 and an object of kind Deployment. In your metadata, you can add a name which will be microback. In the spec section, you will create a template for your containers. This template will have three labels: app=k8scourse-demo, role=backend and microservice=microback. The container for this template will be named microback and will use the images <username>/k8scourse-microback that you just created and pushed to your registry.

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: microback
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: backend
        microservice: microback
    spec:
      containers:
      - name: microback
        image: joellord/k8scourse-microback
```

Inside the container spec, you will also need to add all the environment variables that you had in your old back end deployment. This includes the MYSQL_HOST, MYSQL_USER and MYSQL_PASS. You will also need to add two new environment variables. First, the GIF_CAPTION_SVC variable which will tell our back end what is the name of the service associated with the gif captionizer microservice. And second, the IMAGE_PATH which will be the path that is used by this application to store the images.

```yaml
        env:
        - name: MYSQL_HOST
          value: mysql
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASS
          value: mysql
        - name: GIF_CAPTION_SVC
          value: microgifcap
        - name: IMAGE_PATH
          value: /tmp/gifcaptionizer
```

These pods will have a volume mounted. This volumeMount will be name micro-storage and will be mounted in the container as the /tmp/gifcaptionizer folder. You will also need to add this volume to your template spec. This volume will also have the name micro-storage and will make use of the persistent volume claim called micro-pvc.

```yaml
        volumeMounts:
        - name: micro-storage
          mountPath: /tmp/gifcaptionizer
      volumes:
      - name: micro-storage
        persistentVolumeClaim:
          claimName: micro-pvc
```

Finally, the selector for this deployment will be on the label microservice.

```yaml
  selector:
    matchLabels:
      microservice: microback
```

You will also need to create a deployment for the microgifcap application which will be very similar. Copy everything from the previous deployment and change microback to microgifcap. Because this service is slow, you can add multiple replicas to make sure that the load is distributed between multiple pods. You can also remove the environment variables that are related to MySQL as this pod won’t need access to the database as well as the GIF_CAPTION_SVC but leave the IMAGE_PATH environment variable.

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: microgifcap
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: backend
        microservice: microgifcap
    spec:
      containers:
      - name: microgifcap
        image: joellord/k8scourse-microgifcap
        env:
        - name: IMAGE_PATH
          value: /tmp/gifcaptionizer
        volumeMounts:
        - name: micro-storage
          mountPath: /tmp/gifcaptionizer
      volumes:
      - name: micro-storage
        persistentVolumeClaim:
          claimName: micro-pvc
  selector:
    matchLabels:
      microservice: microgifcap
  replicas: 4
```

Next, you need to create two services for these new deployments. The services will use apiVersion v1 and will be objects of kind Service. The name for the first service will be microback and will have the labels for the role and the microservice. In the spec section, this service will be looking for pods matching the selector microservice=microback. Finally, the port that is used for this service is using the TCP protocol and will map port 80 to the port 3000 inside the container.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: microback
  labels:
    role: backend
    microservice: microback
spec:
  selector:
    microservice: microback
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

The other service will be very similar with the exception that it will have the name microgifcap and the microservice label will be microgifcap. The targetPort for this service is also different, this container runs on port 4000.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: microgifcap
  labels:
    role: backend
    microservice: microgifcap
spec:
  selector:
    microservice: microgifcap
  ports:
    - protocol: TCP
      port: 80
      targetPort: 4000
```

Finally, you will need to update your ingress so your Kubernetes cluster points any incoming requests to the /api routes to your new microservice. For this, you can take the original ingress that you had and copy it in this microservices.yaml file. In the rules section, in the first path-based rule, change the serviceName for the backend to microback.

```yaml
spec:
  rules:
  - http:
      paths:
        - backend:
            serviceName: microback
        ...
```

Your final microservice.yaml file will look like this.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: micro-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: micro-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: microback
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: backend
        microservice: microback
    spec:
      containers:
      - name: microback
        image: joellord/k8scourse-microback
        env:
        - name: MYSQL_HOST
          value: mysql
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASS
          value: mysql
        - name: GIF_CAPTION_SVC
          value: microgifcap
        - name: IMAGE_PATH
          value: /tmp/gifcaptionizer
        volumeMounts:
        - name: micro-storage
          mountPath: /tmp/gifcaptionizer
      volumes:
      - name: micro-storage
        persistentVolumeClaim:
          claimName: micro-pvc
  selector:
    matchLabels:
      microservice: microback
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: microgifcap
spec:
  template:
    metadata:
      labels:
        app: k8scourse-demo
        role: backend
        microservice: microgifcap
    spec:
      containers:
      - name: microgifcap
        image: joellord/k8scourse-microgifcap
        env:
        - name: IMAGE_PATH
          value: /tmp/gifcaptionizer
        volumeMounts:
        - name: micro-storage
          mountPath: /tmp/gifcaptionizer
      volumes:
      - name: micro-storage
        persistentVolumeClaim:
          claimName: micro-pvc
  selector:
    matchLabels:
      microservice: microgifcap
  replicas: 4
---
apiVersion: v1
kind: Service
metadata:
  name: microback
  labels:
    role: backend
    microservice: microback
spec:
  selector:
    microservice: microback
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: microgifcap
  labels:
    role: backend
    microservice: microgifcap
spec:
  selector:
    microservice: microgifcap
  ports:
    - protocol: TCP
      port: 80
      targetPort: 4000
---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: main
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - http:
      paths:
        - backend:
            serviceName: microback
            servicePort: 80
          path: /api(/|$)(.*)
          pathType: Prefix
        - backend:
            serviceName: k8scourse-front
            servicePort: 80
          path: /()(.*)
```

You now have everything you need to deploy your two microservices and redirect all your incoming requests to /api to those services. You can also delete the deployment, service and pods associated with the old monolithic application as you won’t need them anymore.

```bash
kubectl apply -f ./microservices.yaml
kubectl delete deployment,service k8scourse-back
```

There you have it, your application is now no longer a monolith but composed of multiple microservices and is fully deployed in your Kubernetes cluster. The big advantage now is that your full backend is no longer blocked during the image processing required to add the caption to the gifs. You can also increase the number of pods that will be able to captionize those gifs in parallel as you see fit. 

## Lesson 24 - Clean Up Regularly With A Cron Job

There is another issue with the gif captionizer microservice. It takes the gifs, decompose them to have one image per frame, adds the caption to those images and the recompose the gif. The problem is that is leaves everything right there in the tmp folder. After a while, this is going to use up a lot of disk space and you will fill up your persistent volume.

The easy way to fix this would be to change our code so it doesn’t leave all those artifacts after the fact, but for the sake of this exercise, we will use another Kubernetes object to help us achieve this.

So far, you’ve deployed pods that all acted as a web server, but that doesn’t have to be the case. You can also run pods that will do one task. In this case, you will create a pod that will clean up all those temporary files from the persistent volume. The object that you will use will be a CronJob. This CronJob object will start this pod periodically to clean up those files.

First, you can start by creating an object that will use the API version batch/v1beta1. The object will be of kind CronJob. For the metadata, you can put in the name cleanup. This can be done in a file called cronjob.yaml

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cleanup
```

Next, you will start the spec for this Cronjob. First, there will be a schedule. This cron job will run once every minute for now so you can see it in action. The schedule property of cron jobs uses Linux based cron format. In this case, it will be */1 * * * *. Next, you will add the job template. In here, you will describe the pod that will run every minute.

```yaml
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
```

This pod will have a volume that we will mount inside the container. This volume will have the name micro-storage and will use the persistent volume claim named micro-pvc.

```yaml
          volumes:
          - name: micro-storage
            persistentVolumeClaim:
              claimName: micro-pvc
```

Next, you will add a container to this pod. This container will be named cleanup. It will use the universal base image from Red Hat. You could build your own custom image and use it here but we are only running a small bash script to do the cleanup so this image is sufficient. The in the args section, you can start by running /bin/bash followed by the -c to specify a command. This command will be a small script that will loop through all the folders and remove them along with all the files inside of them. This is done with a for loop on the folder /tmp/gifcaptionizer. For each folder, you will do an rm -rf on the name of the folder. You can close this loop with the done instruction.

```yaml
          containers:
          - name: cleanup
            image: registry.access.redhat.com/ubi8/ubi
            args:
            - /bin/bash
            - -c
            - for d in /tmp/gifcaptionizer/*/ ; do rm -rf "$d"; done
```

Next, you will need to mount a volume in this container. This is done with volumeMounts. There will be only one mounted volume which will use the volume called micro-storage that you defined earlier and mount it in the /tmp/gifcaptionizer folder.

```yaml
            volumeMounts:
            - name: micro-storage
              mountPath: /tmp/gifcaptionizer
```

Finally, you need to specify what is the restartPolicy for this pod. In this case, if the pod fails, you don’t need to restart it so the policy will be set to never.

```yaml

          restartPolicy: Never
```

Your final cronjob.yaml file will look like this.

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cleanup
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          volumes:
          - name: micro-storage
            persistentVolumeClaim:
              claimName: micro-pvc
          containers:
          - name: cleanup
            image: registry.access.redhat.com/ubi8/ubi
            args:
            - /bin/bash
            - -c
            - for d in /tmp/gifcaptionizer/*/ ; do rm -rf "$d"; done
            volumeMounts:
            - name: micro-storage
              mountPath: /tmp/gifcaptionizer
          restartPolicy: Never
```

You can now apply this new object to your Kubernetes cluster. You can see your cronjob object with the get command. This should give you some basic information about this job. If you wait a minute, the value for the last schedule should update to show when was the last job. Once a job was started, you can run the get command to list the pods. You should now see a pod with the name starting with cleanup and the status Completed. This shows you that the cron job was performed. If you want to double-check for yourself, you can open a session in the microback pod and see the content of the /tmp/gifcaptionizer folder. In there, you should only see files. You can then exit the container.

```bash
kubectl apply -f ./cronjob.yaml
kubectl get cronjobs
kubectl get pods
kubectl exec -it microback-xxxxxxxx-xxxxxx -- /bin/bash
cd /tmp/gifcaptionizer/
ls
exit
```

This CronJob will now run every minute. If you want to change it to a daily schedule, you can change the value of the schedule parameter to "* * */1 * *". Once the file is changed, you can update your cluster with the apply command.

Running cron jobs regularly can help you perform various tasks on your whole architecture. This could help you automate some of your maintenance tasks.

## Lesson 25 - This Is The End

Hopefully, you managed to deploy everything in your Kubernetes cluster and you now have a good basis to be able to reproduce this in your work environment. A lot of content was covered during this course. You should now have a better understanding of what containers are and how they can be used to help you deploy your application. They can also be very handy to ensure that everyone on your team uses the same versions of all the runtimes.

You should also be more comfortable with the basics of Kubernetes. You’ve seen what pods are and how to use deployments to ensure that you always have a certain number of them up and running. You’ve also seen how networking is done and how services will help you find the pods and distribute the load amongst them. Finally, you’ve also explored multiple objects like ingresses to expose your cluster, persistent volume claims to persist your data and cron jobs to run scheduled tasks.

That is a lot but there is still a lot more that you can do with your Kubernetes cluster. For your next steps, you should look at using secrets to avoid storing passwords in your GitHub repository. You should also look at Tekton pipelines. Those will help you to integrate CI/CD directly inside your Kubernetes cluster. Finally, you should also look at liveness and readiness probes, those will make your architecture more robust and production-ready.

Everything that was demonstrated in this course should run on any Kubernetes cluster. It will also run on an OpenShift cluster. OpenShift is Red Hat’s distribution of Kubernetes. It includes everything that you’ve seen in this course as well as many more functionalities. The first one that comes in mind is a nice UI that will let you visualize all the components that you’ve created so far and let you configure and manipulate them in a way that is much easier than the command-line tool you’ve used all along so far. For more information on OpenShift, you can go to [openshift.com](openshift.com).

With that, thank you for following along, I hope you enjoyed this course and if you have any questions or comments, feel free to reach out via Twitter at [@joel__lord](https://twitter.com/joel__lord).