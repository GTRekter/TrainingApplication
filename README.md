# Development
First start the database
```
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest
docker container ls
docker exec -it 03d87da15bce bin/bash
mysql -h 127.0.0.1 -P 3306 -u root -p
```
then start the API
```
cd E:\Repositories\Training\apis\users\src
node index.js
```
Check that the API is working
```
$baseUrl = "http://localhost:1337"
$endpoint = "/users"
$response = Invoke-RestMethod -Uri ($baseUrl + $endpoint) -Method Get
$response | Format-Table


$endpoint = "/healthcheck"
$response = Invoke-RestMethod -Uri ($baseUrl + $endpoint) -Method Get
$response | Format-Table


$endpoint = "/users"
$userData = @{
    name = "John Doe"
    email = "john.doe@example.com"
}
$jsonData = $userData | ConvertTo-Json
$response = Invoke-RestMethod -Uri ($baseUrl + $endpoint) -Method Post -Body $jsonData -ContentType "application/json"
$response | Format-Table
```
Then start the application
```
cd E:\Repositories\Training\application
yarn start
```

# Deployment
First build a new image
```
docker login acrtrainingdev.azurecr.io
docker build -t acrtrainingdev.azurecr.io/app-application:latest .
docker push acrtrainingdev.azurecr.io/application:latest
```



# Prerequisites
The following application require the following:

**Nginx Ingress*
The documentation is available at the following [link](https://docs.nginx.com/nginx-ingress-controller/installation/installing-nic/installation-with-helm/)
```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx  
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
```
**MySQL Operator**
The documentation is available at the following [link](https://dev.mysql.com/doc/mysql-operator/en/mysql-operator-innodbcluster.html)
```
helm repo add mysql-operator https://mysql.github.io/mysql-operator
helm repo update
helm install mysql-operator mysql-operator/mysql-operator --namespace mysql-operator --create-namespace
```