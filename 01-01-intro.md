# Lesson 1 - Intro

Hi and welcome to this course on Containerization and Kubernetes Deployment. In this course, you will learn the basics of containers and container orchestration.

In the next lessons, we will start by taking an application that was configured for a development environment and deploy it on a Kubernetes cluster. This will be done step by step.

First, you will need to tweak your application so that it can run in containers. Then, you will see how you can use containers to complement your application and run a database without even install the actual software. Eventually, you will create a whole environment with your containers that will enable you to start all the applications with a single command. This can be useful to share the application with your colleagues.

Once you are familiar with container, you will start to explore Kubernetes. You will learn about the basic building blocks and how they all fit together to create and deploy your application. You will also see how you can persist data for your production environment. Eventually, as you get more comfortable with Kubernetes, you will also see how you can break down your monolith application into smaller microservices and deploy those in your cluster.

I hope you are excited to learn all of this! If you are ever blocked, if you need any help or even just to say hi, you can easily get in touch with me via Twitter. My handle is joel__lord and I usually answer back pretty rapidly. My DMs are always open if you need to get in touch.

Before you get started, you will need a few things. First, this application is built with NodeJS. It will be useful but not necessary to have NodeJS installed on your machine so you can test everything locally. If you don’t have NodeJS installed, don’t worry. You won’t be able to run the application locally but as you learn more about containers, you will see how you can use those to run the application without installing NodeJs. To install Node, you can go to http://nodejs.org to find the installation instructions for your operating system.

I am using a Linux operating system on my laptop. The instructions that I will show you will run on both Linux and macOS but might not always work on Windows. I will assume that you have the necessary knowledge about your operating system command-line tools to be able to navigate the folder structure and copy files around. You shouldn’t need more than that.

Next, you will need a container runtime. The examples in this course will be using Docker so you will need to install it for your operating system. Installation instructions can be found at [http://docker.com](http://docker.com). If you are using a Linux based operating system, you can use Podman instead which is a little faster than docker. You can find more information on Podman at [http://podman.io](http://podman.io). If you choose to use the latter, you can create an alias with the command

```bash
alias docker=podman
```

so that you can still use the instructions that will be specified in this course. Podman uses the exact same syntax as docker which makes it easy to switch from one to the other.

In order to download the source code for this application, it would be useful to have git installed on your machine. You can find more information on git at [http://git-scm.com](http://git-scm.com).

For the Kubernetes part, you will need a few more tools. First of all, you will need the kubectl command-line tool to be able to interact with your Kubernetes cluster. You will find all the installation instructions for kubectl at [https://kubernetes.io/docs/tasks/tools/](https://kubernetes.io/docs/tasks/tools/). On that same page, you will also find instructions on how to install minikube. Minikube is a tiny distribution of Kubernetes that can run on your laptop. As we get in the section about Kubernetes, you will see various options that you can use to use Kubernetes but minikube is a good tool to have either way.

Finally, this application will use Giphy as a source of random images. Because I don’t want to exceed my daily quota of random gifs, you will need to use your own API key. You can find out how to do so by going to [http://developers.giphy.com](http://developers.giphy.com) and then click on the "Get Started" button. From there, follow the instructions to create your first application and to get your API key.

If you don’t want to install those tools, there is a container that has all of the tooling necessary that was already created for you to use. The only thing you will need to get this started is Docker. If you have Docker installed, you can use the command in the ./tools/course-env.sh file to start the container with all the tools installed. You will even be able to run Docker from within this container.

That’s all you need for now. You are now ready to get started and to explore the wonderful world of containers and Kubernetes.