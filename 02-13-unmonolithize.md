# Lesson 13 - Unmonolithize Your Backend

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
