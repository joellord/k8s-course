# Lesson 6 - Expose Your Application To The Outside World

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
