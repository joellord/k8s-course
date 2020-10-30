# Lesson 9 - Share images on public registries

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
