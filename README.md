<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Project running guidelines</p>
    <p align="center">

## Docker Compose Steps

01. Install Docker and docker desktop
02. cd into project and deployment folder
03. run:   
docker-compose up -d

Now all your project should be up and running. Mongodb must be run as container first before the lyxa-backend api

## Kind Cluster Mode Steps

1. install kuberetes and kubectl from the docs on your machine 

2. install kind on your machine from the docs

3. Create the cluster:
```bash
$ kind create cluster
```
4. from project root you shall see a makefile. from your terminal run: 
```bash
 make dev_ns
 make project
```
5. After the Cluster is running and all pods are running,
  check if pords are running: kubectl get pods -n dev
  now, port forward your services from terminal tabs:
  
  For accessing api server from browser:
  ```bash 
  kubectl port-forward -n dev svc/lyxa-backend-service 32016:1002 
 ```
  For accessing mondodb from Compass in local machine:
  ``` bash
  $ kubectl port-forward -n dev svc/mongodb-service 32017:27017
  ```
    

  Now, You will be able to browse your swagger docs from browser: http://localhost:32016
