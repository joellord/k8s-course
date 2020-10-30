# Lesson 4 - Containerize the Back-end

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
