# Lesson 3 - Create a Toolbox pod

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
