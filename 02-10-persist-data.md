# Lesson 10 - Persist Data And Volumes

You’re getting closer to have your application running again. Both the front end and the back end are now running. The only missing part of the database. In your local environment, you used a base image for MySQL and that worked well. But if you remember carefully, each time you stopped the container, all the data was also gone. This is due to the ephemeral nature of containers.

To help with this, you will need to use new Kubernetes objects called Persistent Volumes and Persistent Volume Claims. The Persistent Volume Claim (or PVC) is where you will store your data. I order to use a PVC, you will first need to ensure that the storage space was made available by your cluster administrator. This storage space that was made available is called a Persistent Volume (or PV). 

There are many ways to provision these persistent volumes. First, an administrator can manually create a number of persistent volumes. Those are called statically provisioned. This requires administrator access to the cluster. If you are using minikube or crc, you should have the necessary permissions to create a PV. 

If you are using a cloud-based Kubernetes distribution and don’t have the rights to provision Persistent Volumes, you will need to use dynamically provisioned PVs specifically for the PVC you are creating. In this case, you won’t need to create a Persistent Volume but you will need to add a storageClassName to your PVC definition. This will tell the cluster that you are requesting a dynamically provisioned PV that will match your PVC. You will need to refer to the documentation of your cloud provider for this as each provider has their own classes.

For now, you can start by creating both your PV and PVC in a single YAML file called mysql-volume.yaml. These new objects follow the same structure as the previous ones that you created. Starting with the Persistent Volume, you can put in the api version, object kind and metadata properties. In the metadata, you can add the name mysql-pv.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv
```

Next, you will specify the spec of this new object. First, this persistent volume, you will make a 1 gigabyte space available for your cluster. You can specify this in the storage property, under capacity. You will also need to specify all the access modes that this persistent volume will support. There are three access modes possible. The first one is ReadOnlyMany. This is for a persistent volume that would be mounted in read mode only. The other two, ReadWriteOnce and ReadWriteMany will provide you with read and write access. The Once or Many properties refers to how many nodes can have access to it. Because this PV is for single-node clusters (minikube or crc), you can use the ReadWriteOnce access mode. Finally, because this is on a single node cluster, you will need to specify the host path. This is where the volume will be mounted in the node. This property is not used when using a multi-node cluster as you would normally do in the cloud. This PV will be located in the /mnt/data folder of our node.

```yaml
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

This is all that is needed for the persistent volume. Keep in mind that this is for a single node system like minikube or crc. If you are using a cloud-based setup, the PVs will either be made available to you by an administrator or will be dynamically provisioned by using the storage class property of the PVC.

Now that you have a persistent volume in your cluster, you will be able to claim to space for your pods by using a persistent volume claim. This new object will start just like all other Kubernetes object, with an api version, a kind property and some metadata. In this case, it will be an object of kind PersistentVolumeClaim and you can give it the name mysql-pvc.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
```

The spec part of this object will specify the properties that we expect for our volume. In this case, we will need a persistent volume that has a ReadWriteOnce access mode and at least one gigabyte of available disk space. This storage requirement is a minimum. If the cluster only had PVs with 2 gigabytes available, this is what you would have for this PVC. On the other hand, if we requested for a 2Gi storage minimum and the cluster only had 1Gi persistent volumes, this wouldn’t work.

```yaml
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Once again, this will work on either minikube or code ready containers. If you have a cloud-based provider for your Kubernetes cluster, you will need to look up their documentation to find out how to create a persistent volume claim. Typically, you would only have a persistent volume claim similar to the one you just created but it would also have a storageClassName property that would allow for dynamically provisioned persistent volumes. 

You mysql-pv.yaml file with the definition of both the persistent volume and the persistent volume claim for a single node cluster should now look like this.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv
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
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

You can now apply this file to your cluster and see the newly created resources. You can use the get command with objects separated by commas to see multiple types at once.

```bash
kubectl apply -f ./mysql-pv.yaml
kubectl get pv,pvc
```

You should see the newly created persistent volume and persistent volume claim. If you use a cloud-based provider, you might only have a persistent volume claim here. Now that you have created your PVC and claimed some disk space, you are ready to use this with a deployment so that you database will be able to keep the data even if the pod itself crashes or gets restarted.
