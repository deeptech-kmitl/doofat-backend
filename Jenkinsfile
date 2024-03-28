pipeline {
    agent any

    environment {
        // It's good practice to keep sensitive or specific data like Docker images, remote hosts, and credentials out of the script for security and flexibility.
        DOCKER_IMAGE    = '64070067/doofat:latest' // Ensure this Docker image name is correct and accessible.
        REMOTE_HOST     = 'nebula@34.124.227.97' // Replace with your actual username and remote IP.
        SSH_CREDENTIALS = 'ssh-prod_instance' // Use the ID of the Jenkins stored SSH credentials.

        DOCKER_CREDENTIALS = credentials('dockerhub')

        // App Env
        DATABASE_URL = credentials("DATABASE_URL")
        SESSION_SECRET = credentials("SESSION_SECRET")
        SECRET_KEY = credentials("SECRET_KEY")

        GOOGLE_CLIENT_ID = credentials("GOOGLE_CLIENT_ID")
        GOOGLE_CLIENT_SECRET = credentials("GOOGLE_CLIENT_SECRET")

        FACEBOOK_CLIENT_ID = credentials("FACEBOOK_CLIENT_ID")
        FACEBOOK_CLIENT_SECRET = credentials("FACEBOOK_CLIENT_SECRET")
    }

    stages {
        stage('Build Docker Image') {
              steps {
                      // Build the Docker image

                      dir('./') {
                        sh 'echo "Running in $(pwd)"'
                        sh 'echo start build the Docker image = $DOCKER_IMAGE'
                        sh 'docker build -t $DOCKER_IMAGE .'
                      }

              }
        }
        stage('Push to Docker Hub') {
            steps {
                script {

                    // Login to Docker Hub
                    sh 'echo $DOCKER_CREDENTIALS_PSW | docker login --username $DOCKER_CREDENTIALS_USR --password-stdin'
                    // Push the image
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }
        stage('Login to Docker Hub') {
            steps {
                // This step logs into Docker Hub using credentials stored in Jenkins.
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USER')]) {
                    sh 'echo $DOCKERHUB_PASSWORD | docker login --username $DOCKERHUB_USER --password-stdin'
                }
            }
        }

        stage('Run Docker on Remote Server') {
            steps {
                // Uses the SSH Agent plugin to setup SSH credentials.
                sshagent([SSH_CREDENTIALS]) {
                    // These commands manage Docker containers on the remote server.
                    // It stops and removes all containers, then removes all images, before running a new container.
                    sh "ssh -o StrictHostKeyChecking=no $REMOTE_HOST 'docker stop \$(docker ps -a -q) || true'"
                    sh "ssh -o StrictHostKeyChecking=no $REMOTE_HOST 'docker rm \$(docker ps -a -q) || true'"
                    sh "ssh -o StrictHostKeyChecking=no $REMOTE_HOST 'docker rmi \$(docker images -q) || true'"
                    sh "ssh -o StrictHostKeyChecking=no $REMOTE_HOST 'docker run --network='host' -d -e DATABASE_URL='$DATABASE_URL' \
-e SESSION_SECRET='$SESSION_SECRET' \
-e SECRET_KEY='$SECRET_KEY' \
-e GOOGLE_CLIENT_ID='$GOOGLE_CLIENT_ID' \
-e GOOGLE_CLIENT_SECRET='$GOOGLE_CLIENT_SECRET' \
-e FACEBOOK_CLIENT_ID='$FACEBOOK_CLIENT_ID' \
-e FACEBOOK_CLIENT_SECRET='$FACEBOOK_CLIENT_SECRET' \
-p 80:80 \
--name doofat $DOCKER_IMAGE'"
                    sh "ssh -o StrictHostKeyChecking=no $REMOTE_HOST 'docker ps -a'"
                }
            }
        }
    }
}
