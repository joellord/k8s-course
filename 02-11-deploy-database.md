# Lesson 11 - Deploy Your Database

Now that you have some disk space available, you are ready to create the deployment and service for your database. These are very similar to what you have done already for the front end and the back end. First, for the deployment, you can start with a new file called mysql.yaml. It will contain the usual api version, kind and metadata.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
```

Next, for the spec, you will write a selector to match pods that have a label role = db. Then, you will be ready to write the template for your pods. These pods will have the usual metadata. They will have two labels, one for the app name which is k8scourse and another one for the role, this is db and is the one used by your selector.

```yaml
spec:
  selector:
    matchLabels:
      role: db
  template:
    metadata:
      labels:
        app: k8scourse
        role: db
```

Next, in the spec section of the pod template, you will add the required container for this pod as well as the volumes that you will mount inside that container.

```yaml
    spec:
      containers:
        ...
      volumes:
       ...
```

First, you can start with the container. This container will use the mysql:5.7 base image and will require a few environment variables. You can name this container mysql. Thes environment variables are the same that were used when this container was used with docker. You will also need to add the ports for this container. In this case, MySQL runs on port 3306 by default so you can keep that value.

```yaml
      containers:
      - image: mysql:5.7
        name: mysql
        env:
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASSWORD
          value: mysql
        - name: MYSQL_ROOT_PASSWORD
          value: root
        ports:
        - containerPort: 3306
```

You will also need to mount your volume here but first, you will need to add your persistent volume claim to the pod so that it can be mounted in the container. In the volumes section of the template spec property, you will need to give a name to this volume. You can call it mysql-storage. Then, you will need to specify with persistent volume claim will be used for this volume, in this case, it’s the mysql-pvc one that we just created.

```yaml
spec:
  ...
  template:
    spec:
      containers:
        ...
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
```

Now, you can go back to the container spec and add the volume mount to the container template. First, add a volumeMounts array to the containers section. Then add the name of the volume to be mounted. This is the name of the volume you just added in the volumes section, mysql-storage. Then, you will specify where this volume should be mounted. In this case, you will mount it to the /var/lib/mysql folder which is the folder that is used to store all the MySQL data.

```yaml
  template:
    spec:
      containers:
        ...
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
```

This deployment will now create a pod with the MySQL base image container and a persistent volume claim linked to it. If you restart this pod, all of your data will be persisted. 

In order for your other services to be able to connect to this pod, you will also need to create a service. This Kubernetes object will use API version v1, will be of kind Service and will have the name mysql.

```yaml
apiVersion: v1
kind: Service
metadata: 
  name: mysql
```

This service will map the port 3306 from the pods, which is the exposed port from your containers. It will also route traffic to pods that have the label role set to db.

```yaml
spec:
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
  selector:
    role: db
```

Your completed mysql.yaml file should contain both your deployment and your service and should look like this.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  ports:
  - port: 3306
  selector:
    role: db
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      role: db
  template:
    metadata:
      labels:
        app: k8scourse
        role: db
    spec:
      containers:
      - image: mysql:5.7
        name: mysql
        env:
        - name: MYSQL_USER
          value: user
        - name: MYSQL_PASSWORD
          value: mysql
        - name: MYSQL_ROOT_PASSWORD
          value: root
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
```

You can now apply this file to the cluster to start your pod containing the database. Once this file has been applied, you can get the pod that runs the MySQL database and login it to test out the database. Once inside the cluster, you can use the mysql command to enter the database terminal. Use the -u and -p parameters to specify the user name and password that were provided in the environment variables. In this case, the credentials will be user for the user name and mysql for the password. Once you are in the database terminal, you can use the SHOW DATABASES command to list the databases that are available. Don’t forget the semi-colon after the SQL query. You should see a single database called information_schema.

```bash
kubectl apply -f ./mysql.yaml
kubectl get pods -l section=db
kubectl exec -it <mysql-pod-name> -- /bin/bash
mysql -uuser -pmysql
SHOW DATABASES;
exit
exit
```

You can exit the MySQL terminal with exit and disconnect your bash session with the pod with the exit command.

Your database is now up and running and is almost ready to be used by the back end service. You just need to initialize your database with the seed data that you previously had and then connect the back end to the database.
