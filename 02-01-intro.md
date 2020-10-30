# Lesson 1 - Intro to Kubernetes

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
