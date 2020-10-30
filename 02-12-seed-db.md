# Lesson 12 - Seed the Database And Connect The Backend

Now that you have a running database, you will need to initialize it with the initial data set. You can use Kubernetes to start new containers on the go and remove them afterwards. This is what you will do here to create a MySQL client that will connect to your database.

First, start with the run command. You will use the -it flags to run this container in interactive mode. Then, use the --rm flag. This is similar to when you used it with docker. It will remove the pod once this command is completed. Next, specify the image you want to use, in this case, you will use the mysql:5.7 base image. Next, tell Kubernetes not to restart this pod after completion with the --restart parameter. Finally, you can give a name to this pod, mysql-client in this case. This pod’s MySQL server won’t be used, you will only run this pod to have access to the client. For this ready, you can add an environment variable so that MySQL picks a random root password for you.

```bash
kubectl run --image=mysql:5.7 --restart=Never --env="MYSQL_RANDOM_ROOT_PASSWORD=true" mysql-client
```

Now that you have a pod with a MySQL client up and running, you can copy a file from your file system into that specific pod. To do so, you can use the cp command. Using that command, you can copy files to or from the pod. In this case, you will take the init.sql from your local filesystem and copy it into the mysql-client pod filesystem. You can copy that file into the /tmp folder of the pod. Once the file is copied, you can open a session in the pod with the exec command and you should be able to see that file.

```bash
kubectl cp ../db/init.sql mysql-client:/tmp/init.sql
kubectl exec -it mysql-client -- /bin/bash
ls /tmp
```

Now, still from your bash session in the mysql-client pod, you can use the mysql cli tool to access your MySQL server running in your cluster. This can be done by using the name of the service to locate the associated pods. 

Start with the mysql executable and use the parameter -h to specify the host. The host, in this case, is the name of the service that points to your MySQL server, which is mysql. Next, you will need root access to execute the init.sql script. The root access is needed in order to create a database and to give the non-root user all the privileges needed to read and write to this database. The root password was specified as part of the environment variables in the MySQL deployment file. If you followed the instructions, the root password should be root. Finally, you can specify a file to be executed on this host with this user. The file in question will be the init.sql file that you just copied over.

```bash
mysql -hmysql -uroot -proot < /tmp/init.sql
```

This will run this SQL script against your existing MySQL server. In the previous lessons, you used the docker entry point and copied the file over. This worked well when you started a new pod every time and didn’t care about persisting your data. Now that you are moving into a production server, the structure of your database might need to be changed from time to time but you don’t want to start with a blank database every time. This is why you are importing this file manually once.

Now that your database is populated, you can exit the terminal with the exit command. You can also delete this pod as you won’t need it anymore.

```bash
exit
kubectl delete pod mysql-client
```

If you want to test your database setup, you can delete the pod that contains the mysql server. Your deployment will automatically create a new one and link it to the volume as specified in the pod template. You can then start a mysql-client instance again. This time, you will use the --rm flag. This will remove the pod automatically once you are done with the mysql terminal. It is a convenient way to create pods and automatically clean them up once you are done.

Once you’re inside that terminal, you can switch to the images database and then perform a select query to get all the records from the images table. If the persistent volume claim is configured correctly, you should see a record with the caption Hello.

```bash
kubectl delete pods -l role=db
kubectl run -it --rm --image=mysql:5.7 --restart=Never mysql-client -- mysql -hmysql -uuser -pmysql
```
```sql
use images;
select * from images;
```
```bash
exit
```

Your database is now populated and ready to be used by your backend. In order to connect your backend to the database, you will need to add environment variables so that your server knows how to find the MySQL database.

To do so, you can open up the backend.yaml file you created earlier. From here, in the containers section of the template for your deployment, add the environment variables that are needed by the back end.

```yaml
spec:
  template:
    ...
    spec:
      containers:
        ...
        env:
        - name: MYSQL_HOST
          value: mysql
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASS
          value: mysql
```

You can now apply this new deployment to your cluster with the apply command. Notice how the deployment shows as configured while the service shows as unchanged. Kubernetes will validate if there are any changes and won’t restart the service if it doesn’t have to.

```bash
kubectl apply -f ./backend.yaml
```

Because there was a change in the deployment, Kubernetes will immediately start a new pod for the backend and once it is running, it will delete the old one. This is done in such a way that your users won’t notice a downtime.

Everything is now up and running in your cluster. You have a front-end running on an nginx server which will serve the UI to your users. There is a NodeJS backend that processes the requests from your UI. And finally, you now have a database that will persist data. You can now open up your browser and point it to your Kubernetes cluster. From there, you can now access the full application. If you have a sudden burst of traffic, you can also easily increase the number of pods that are running and decrease them afterwards using the scale command. Finally, if any of your pods crashes, Kubernetes will self heal and automatically restart those for you.
