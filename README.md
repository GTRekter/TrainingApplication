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
helm install mysql-operator mysql-operator/mysql-operator -n mysql-operator --values values.yaml --create-namespace
helm install mysql-cluster mysql-operator/mysql-innodbcluster --set tls.useSelfSigned=true --values values.yaml -n default
```
# Create test DB
```
 kubectl run --rm -it myshell --image=container-registry.oracle.com/mysql/community-operator -- mysqlsh
If you don't see a command prompt, try pressing enter.

 MySQL  SQL > \connect root@mysql-cluster
Creating a session to 'root@mysql-cluster'
Please provide the password for 'root@mysql-cluster': ******
Save password for 'root@mysql-cluster'? [Y]es/[N]o/Ne[v]er (default No): yes
Fetching global names for auto-completion... Press ^C to stop.
Your MySQL connection id is 0
Server version: 9.0.1 MySQL Community Server - GPL
No default schema selected; type \use <schema> to set one.
 MySQL  mysql-cluster:3306 ssl  SQL > CREATE DATABASE testdb;
  MySQL  mysql-cluster:3306 ssl  SQL > CREATE TABLE IF NOT EXISTS users (
                                   ->   id INT AUTO_INCREMENT PRIMARY KEY,
                                   ->   name VARCHAR(255) NOT NULL,
                                   ->   email VARCHAR(255) NOT NULL UNIQUE
                                   -> );
ERROR: 1046 (3D000): No database selected
 MySQL  mysql-cluster:3306 ssl  SQL > USE testdb;
Default schema set to `testdb`.
Fetching global names, object names from `testdb` for auto-completion... Press ^C to stop.
 MySQL  mysql-cluster:3306 ssl  testdb  SQL > CREATE TABLE IF NOT EXISTS users (
                                           ->   id INT AUTO_INCREMENT PRIMARY KEY,
                                           ->   name VARCHAR(255) NOT NULL,
                                           ->   email VARCHAR(255) NOT NULL UNIQUE
                                           -> );
Query OK, 0 rows affected (0.0515 sec)
 MySQL  mysql-cluster:3306 ssl  testdb  SQL > INSERT INTO users (name, email) VALUES ('John Doe', 'johndoe@example.com');
Query OK, 1 row affected (0.0088 sec)
 MySQL  mysql-cluster:3306 ssl  testdb  SQL > SELECT * FROM users;
+----+----------+---------------------+
| id | name     | email               |
+----+----------+---------------------+
|  1 | John Doe | johndoe@example.com |
+----+----------+---------------------+
1 row in set (0.0007 sec)
 MySQL  mysql-cluster:3306 ssl  testdb  SQL > quit
```