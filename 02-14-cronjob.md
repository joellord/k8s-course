# Lesson 14 - Clean Up Regularly With A Cron Job

There is another issue with the gif captionizer microservice. It takes the gifs, decompose them to have one image per frame, adds the caption to those images and the recompose the gif. The problem is that is leaves everything right there in the tmp folder. After a while, this is going to use up a lot of disk space and you will fill up your persistent volume.

The easy way to fix this would be to change our code so it doesn’t leave all those artifacts after the fact, but for the sake of this exercise, we will use another Kubernetes object to help us achieve this.

So far, you’ve deployed pods that all acted as a web server, but that doesn’t have to be the case. You can also run pods that will do one task. In this case, you will create a pod that will clean up all those temporary files from the persistent volume. The object that you will use will be a CronJob. This CronJob object will start this pod periodically to clean up those files.

First, you can start by creating an object that will use the API version batch/v1beta1. The object will be of kind CronJob. For the metadata, you can put in the name cleanup. This can be done in a file called cronjob.yaml

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cleanup
```

Next, you will start the spec for this Cronjob. First, there will be a schedule. This cron job will run once every minute for now so you can see it in action. The schedule property of cron jobs uses Linux based cron format. In this case, it will be */1 * * * *. Next, you will add the job template. In here, you will describe the pod that will run every minute.

```yaml
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
```

This pod will have a volume that we will mount inside the container. This volume will have the name micro-storage and will use the persistent volume claim named micro-pvc.

```yaml
          volumes:
          - name: micro-storage
            persistentVolumeClaim:
              claimName: micro-pvc
```

Next, you will add a container to this pod. This container will be named cleanup. It will use the universal base image from Red Hat. You could build your own custom image and use it here but we are only running a small bash script to do the cleanup so this image is sufficient. The in the args section, you can start by running /bin/bash followed by the -c to specify a command. This command will be a small script that will loop through all the folders and remove them along with all the files inside of them. This is done with a for loop on the folder /tmp/gifcaptionizer. For each folder, you will do an rm -rf on the name of the folder. You can close this loop with the done instruction.

```yaml
          containers:
          - name: cleanup
            image: registry.access.redhat.com/ubi8/ubi
            args:
            - /bin/bash
            - -c
            - for d in /tmp/gifcaptionizer/*/ ; do rm -rf "$d"; done
```

Next, you will need to mount a volume in this container. This is done with volumeMounts. There will be only one mounted volume which will use the volume called micro-storage that you defined earlier and mount it in the /tmp/gifcaptionizer folder.

```yaml
            volumeMounts:
            - name: micro-storage
              mountPath: /tmp/gifcaptionizer
```

Finally, you need to specify what is the restartPolicy for this pod. In this case, if the pod fails, you don’t need to restart it so the policy will be set to never.

```yaml

          restartPolicy: Never
```

Your final cronjob.yaml file will look like this.

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cleanup
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          volumes:
          - name: micro-storage
            persistentVolumeClaim:
              claimName: micro-pvc
          containers:
          - name: cleanup
            image: registry.access.redhat.com/ubi8/ubi
            args:
            - /bin/bash
            - -c
            - for d in /tmp/gifcaptionizer/*/ ; do rm -rf "$d"; done
            volumeMounts:
            - name: micro-storage
              mountPath: /tmp/gifcaptionizer
          restartPolicy: Never
```

You can now apply this new object to your Kubernetes cluster. You can see your cronjob object with the get command. This should give you some basic information about this job. If you wait a minute, the value for the last schedule should update to show when was the last job. Once a job was started, you can run the get command to list the pods. You should now see a pod with the name starting with cleanup and the status Completed. This shows you that the cron job was performed. If you want to double-check for yourself, you can open a session in the microback pod and see the content of the /tmp/gifcaptionizer folder. In there, you should only see files. You can then exit the container.

```bash
kubectl apply -f ./cronjob.yaml
kubectl get cronjobs
kubectl get pods
kubectl exec -it microback-xxxxxxxx-xxxxxx -- /bin/bash
cd /tmp/gifcaptionizer/
ls
exit
```

This CronJob will now run every minute. If you want to change it to a daily schedule, you can change the value of the schedule parameter to "* * */1 * *". Once the file is changed, you can update your cluster with the apply command.

Running cron jobs regularly can help you perform various tasks on your whole architecture. This could help you automate some of your maintenance tasks.
