# Lesson 8 - Use paths to expose multiple services

In the last lesson, you created the deployment and service required for the back end to run. This works well but this API needs to be exposed externally for the front end to be able to connect to it. This is because the HTTP requests from your application are coming from inside the browser running on your user’s system and not from within the cluster itself. To make the API available, you will use the same ingress you had previously but you will now add multiple paths for the various services that you want to expose.

To do that routing, you will decompose the path of the request in multiple parts using regular expressions. Then, you will use a series of rules in your Ingress spec to indicate to which service should the traffic be routed.

First you will keep the first four lines of your original ingress. The rest can be deleted for now.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: main
```

Let’s now move on to the spec section. Instead of having a single backend here, you will have a rules object. This object will have some HTTP rules around paths. In here, you will be able to put in an array of backends.

```yaml
spec:
  rules:
  - http:
      paths:
      - backend:
```

The rules will be applied in the order in which they are specified in the YAML file. To leverage that, the first rule will look to see if the path starts with /api. If not, then it will fall to the last rule which will match any other route.

The first backend will map to the k8scourse-back service, and to the port 80. Next, you can write the regular expression that will match a path that starts with /api, followed by a backslash and a wildcard for the rest of the path. The sets of parentheses will come in handy later on. Finally, the match will be done on a URL path prefix split by / so you can add the property pathType to Prefix.

```yaml
        - backend:
            serviceName: k8scourse-back
            servicePort: 80
          path: /api(/|$)(.*)
          pathType: Prefix
```

Now, the next backend will match all the other requests that don’t start with the prefix /api. It will then map to the service k8scourse-front and to the port 80. Note that the path has an empty set of parentheses. This is to match the regular expression of the first backend. By adding this empty set, we will use the content of the second match in each regular expression with the service.

```yaml
        - backend:
            serviceName: k8scourse-front
            servicePort: 80
          path: /()(.*)
```

Now that our two backends are defined, any traffic coming to /api/foo will be redirected to the k8scourse-back service. Any other request, like /foo/bar, would be redirected to the front-service. This will cause a small problem though. Our NodeJs express server defines the routes from the base path. Meaning that the route /health will work but the route /api/health does not exist in our server. This is where our special regular expressions will come in handy.

Back to the metadata section of the ingress, you will need to add a rewrite rule. You will add an annotation of type rewrite-target. Then, you will tell the ingress to rewrite this URL as the second element of the matching regular expression.

```yaml
metadata:
  ...
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
```

Using this rule, a call to /api/health will be redirected to k8scourse-back/health. Because we have an empty set of parentheses on the second rule, it will match the full path. Meaning that a call to /foo/bar will stay intact and be redirected to k8scourse-front/foo/bar.

Your final ingress.yaml file should now look like this.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: main
  annotations:
   nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - http:
      paths:
        - backend:
            serviceName: k8scourse-back
            servicePort: 80
          path: /api(/|$)(.*)
          pathType: Prefix
        - backend:
            serviceName: k8scourse-front
            servicePort: 80
          path: /()(.*)
```

You can now apply this new ingress file. No need to delete the existing ingress, Kubernetes will recognize the name and apply the changes. You can also test the new ingress by doing curl requests to the front end and to the /health route of the api.

```bash
kubectl apply -f ./ingress.yaml
curl <path-to-kubernetes>
curl <path-to-kubernetes>/api/health
```

If you try the application in your browser, you should see the front end but the calls to the API still won’t work. You can open the network tab of your developer tools and you will see that the requests are still going to the wrong address. To fix this, you will need to update your front end environment variable to use this new base URL.
