# Lesson 4 - Create the front-end deployment

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
