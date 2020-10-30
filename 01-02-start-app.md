# Lesson 2 - Starting the application

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

This NodeJS backend has a /health route that was built-in by the team that built this application. It can provide you with the status of your API: it checks the status of the server and the database and returns the status and a timestamp. This route can be used to test your server.

You can do so by doing a curl or by opening the browser to [localhost:3000/health](localhost:3000/health).

```bash
curl localhost:3000/health
```

Wow, we’re off to a good start, aren’t we? We’ve got our first bug. You can see that there is an error code that specifies ECONNREFUSED.

You can dig into the error trace to see where this originates from if you’d like. You will quickly notice that this error comes from the fact that we don’t have a running MySQL server. Our application requires a connection to the database to list the previous GIF creations to the visitors of the web site and without a running database, nothing works.

Note that you might also receive a message at this point that specifies something like Access denied for user 'root'@'172.17.0.1' (using password: YES). If that is the case, you probably have a running MySQL server running on your machine at the moment and you will need to stop it before you can continue to the next step.

So, how can we start a database without spending too much time configuring this database? This is where our containers will come to help us.

In the next lesson, we will start our first container that will contain the necessary database.
