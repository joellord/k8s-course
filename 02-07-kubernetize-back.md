# Lesson 7 - Kubernetize Your Backend

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
