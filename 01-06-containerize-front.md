# Lesson 6 - Containerize the front end with a multi-step build

## Mini talk intro

In the last lessons, you saw how to use containers and how to create one for your backend. Now is the time to see more advanced container images. In this lesson, we will actually use a container to build our container. This is called a multi-stage build. 

For your front end, a VueJs application has been created from the CLI. VueJS, just like React and Angular applications have a development mode as well as a production mode. When you started the front end at the beginning of this course, you’ve used "npm run serve". This is a development server that is built with NodeJs. It watches your files for changes and is optimized to recompile the application and refresh your browser automatically. 

When you are building a React application, you have a similar setup. You can use the `create-react-app` CLI tool to build the skeleton for your application. This skeleton will include, not only the base files for your application but also a full development environment with a server that watches your files for changes and refreshes your browser automatically.

These tools are great for development purposes. It makes it much quicker to see the resulting application and is better suited for debugging.

Once you are ready to deploy this application though, you won’t want to use the same setup. This development environment is somewhat slow and has a lot of code that is not used. There is no need to watch your files for changes in production as they shouldn't change. 

Ideally, for your production server, you would like to ship a minified version of your code. This will cut down the download time to see the initial page. Some build scripts will even perform tree shaking which is a method to find all the code that is not used in your application and simply remove it. Some CSS frameworks and tooling like Tailwind can also check your code for unused classes and remove them. Finally, you will want your application to be usable by the greatest number of users possible so you might need to do add some additional prefixes to your CSS styling or some patches to support some JavaScript features on older browsers.

To do this, you will need to run a script to build your production application. This script will take all of your JavaScript files and merge everything in a single minified JavaScript file. It will do the same for your CSS. It might also perform some transpiling and other tasks like tree-shaking for you.

By doing so, you will end up with a minimal set of files. Typically, a single HTML, JavaScript and CSS file for a total of only three files to download. These files can then be hosted just about anywhere.

Since this course is about containers, you will be using an Nginx container to serve those files. Nginx is an open source, high-performance HTTP server that will be able to handle many requests to your front end.

When building our front end container, we will only want a container that has Nginx and the minimal HTML, CSS and JavaScript files, not the full NodeJs runtimes and source code. 

This is why we will use a multi-step build. The first step will use a container with NodeJs to create the files. It's sole purpose is to run the build script to create that production version. The second step will create your Nginx server with the three files that were generated in the first step. 

The container that was used to generate your production files will then be discarded and you will only be left with the second container which is lightweight and optimized for the web.

You can use multi stage containers to perform various operations on your source code and the copy the output to the next step. You can even create your own CI/CD pipelines by running multiple steps inside a Docker build. The resulting image will only be the last image that was created and all the additional overhead from the previous steps is discarded.

## Lesson script

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
