# Lesson 5 - Create the front end service

In the last lesson, you create a deployment which in turn created a couple of pods running your containers. Because the pods are meant to be easily started or stopped, it is hard to keep track of those random names they were given. This is where the Service object will help you.

A Kubernetes Service is an object that helps you find a set of pods. It will take care of the networking for you. From a service, you will be able to map ports and to do load balancing between the different pods that you have running. This is why scaling is easier to do with Kubernetes. You can change the number of pods that you have running at any given time and as long as you have a service to expose those pods, everything will be handled automatically for you.

A service will also give your pods an internal IP address and DNS entry so that they can be reached from other pods inside your cluster.

In the previous lesson, you already created a deployment and you are ready to expose them through a Kubernetes Service. Just like the other objects you’ve built so far, this one will also take an apiVersion, a kind and some metadata. Start by creating a service.yaml file and add these.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8scourse-front
  labels: 
    role: frontend
```

Next, you need to specify which pods will be associated with this service. Just like you did with your deployment, you can use a label to select those pods. When using kubectl get, you can use the -l command. This will list the objects that are associated with a specific label. This can be useful if you want to test out your selector first.

```bash
kubectl get pods -l role=frontend
```

Once you are happy with your selector, you can start working on the spec section of the service. By default, this service will be a load balance and will distribute the loads between a number of pods based on the labels you specified.

```yaml
spec:
  selector:
    role: frontend
```

Finally, you will need to add a port mapping. This is similar to the way it was done with your container. In this case, the port is the port that will be used to access the service and the targetPort is the port on which the pods are serving content. 

```yaml
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

Your completed service.yaml file should look like this.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8scourse-front
  labels: 
    role: frontend
spec:
  selector:
    role: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

This service can now be applied to your cluster using the apply command.

```bash
kubectl apply -f ./service.yaml
```

If you do a get to list the current services, you will see this new k8scourse service that you just created. You will also see the port that is uses as well as an internal ip address. This address can also be found inside any pod in the cluster as these values will be injected in the pods as environment variables. You can see this by first deleting all of your pods. You can also use a -l argument here to select only the pods with a specific label. Because you have a deployment in place already, Kubernetes will automatically restart two of them to replace those you deleted. Now list the pods to see their names and run the printenv on one of the pods with the exec command. This Linux command prints out all the environment variables.

```bash
kubectl delete pods -l role=frontend
kubectl get pods
kubectl exec <pod name> -- printenv
```

You should see a VALUE for K8SCOURSE_SERVICE_HOST. This is the internal IP address of your service. If you curl this IP address, your request will time out. This is because this address only exists from within the cluster.

If you have your toolbox pod running, you will also need to restart it so that it has access to the environment variables. There is now restart functionality on pods in Kubernetes so you will need to terminate the pod by deleting it and then restart it using the apply command. 

```bash
kubectl delete pod toolbox
kubectl apply -f ./toolbox.json
```

Once your Toolbox pod is started, you can open a session on it and curl your front end. This will serve you the content from the application. 

```bash
kubectl exec -it toolbox -- /bin/bash
curl $K8SCOURSE_SERVICE_HOST:$K8SCOURSE_SERVICE_PORT
```

Because there is an internal DNS, you can also access the service by using the name you gave it in the YAML file. Doing a curl on k8scourse-front should give you the same result. You can then exit this pod.

```bash
curl k8scourse-front
exit
```

There you have it. Your service now lets you connect to your pods. The only issue right now is that you have to be inside your cluster in order to communicate with the internal pods. In order to expose your front end to the rest of the world, you will need another Kubernetes object called the Ingress. 
