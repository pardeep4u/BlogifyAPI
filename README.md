# BlogifyAPI

**BlogifyAPI** offers a reliable and user-friendly **RESTful API** implemented in **Node.js** and **Express.js** for bloggers who value efficiency and simplicity. Embrace the ease of RESTful architecture. It is suitable for individual bloggers and small teams.

Certainly! Let's dive deeper into the backend-features of BlogifyAPI

## Backend features

-   **NGINX** as reverse proxy and load balancer.
-   Fully containerized using **Docker** technology.
-   Implementing token-based authentication using **JSON Web Tokens (JWT)**.
-   Implementing query caching with **RedisDB** to boost performance.
-   Performing Data Validation on the server for data integrity.
-   Writing unit tests using **Jest** for code coverage.
-   Eslint and Prettier Integration.
-   Integrating an **AWS S3** bucket to store uploaded files.
-   Advance Data queries for traversing the data.
-   Follow the **MVC** (Model View Controlller) architecture.
-   Automating **CI/CD** workflows with **GitHub Actions**.
-   Deployed the application on an **Amazon EC2** VM.

## How to use this Project

### **Requirements**

-   **Docker**: Set up Docker to containerize the entire backend application, including all necessary dependencies and services. This ensures consistent and isolated environments across different systems.

-   **Docker Compose**: Use Docker Compose to define and manage the multi-container application.

-   **CI/CD Workflows with GitHub Actions**: Automate Continuous Integration (CI) and Continuous Deployment (CD) workflows using GitHub Actions. Set up automated tests, code quality checks, and deployment to ensure a smooth development and deployment process.
-   **Amazon EC2 VM** Deployment: Deploy the application on an Amazon EC2 virtual machine (VM) to make it accessible to users over the internet.

### To Run this Project Locally

1. First Create a `backend.env`.
2. Add all enviroment variables in this file. Here is an Example.

```

REDIS_PORT=6379  //Do not change value using in Docker-compose file

REDIS_HOST=redisservice  //Do not change value using in Docker-compose file

PORT=3050 //Do not change value using in Docker-compose file

JWT_TOKEN_FOR_TESTING={Generate a token with infinty time.}

JWT_SECRET={put your own secret value}

AWS_ACCESS_KEY={put here aws access key for s3 bucket}

AWS_SECRET_KEY={put here aws secret key for s3 bucket}

AWS_REGION={put here aws region in which s3 bucketis hosted}

MONGODB={ put here mongoDB url }

TRANSPORTER_EMAIL={put here Email address for sending mails}

TRANSPORTER_EMAIL_PASS={Get this value from google mail verification}

AWS_BUCKET_NAME={put here aws bucket name}



```

`Remove all these comments like // and {} from this file`

3. Move this file to env folder.
4. Turn on the docker daemon engine.
5. Run the following command in your cmd to start the server.
   `docker-compose up -d`
6. Now visit `http://localhost:3050/`. </br>
   for more information about API endpoints visit documentation.
