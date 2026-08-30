pipeline {
    agent any

    environment {
        APP_NAME = "invoicer"
        CONTAINER_PORT = "3000"
    }

    stages {
        stage('Install & Test') {
            steps {
                echo '📦 Installing dependencies and running unit tests...'
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🔨 Packaging application into production container image...'
                sh 'docker build -t $APP_NAME:latest .'
            }
        }

        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying client application to port 3000...'
                sh '''
                    docker stop $APP_NAME || true
                    docker rm $APP_NAME || true
                    docker run -d --name $APP_NAME -p $CONTAINER_PORT:3000 $APP_NAME:latest
                '''
            }
        }

        stage('Smoke Test Deployment') {
            steps {
                echo '🔍 Verifying deployment health...'
                sh 'sleep 4'
                sh 'curl -f http://host.docker.internal:3000/health || curl -f http://172.17.0.1:3000/health || exit 1'
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment complete! Invoicer App is live.'
        }
        failure {
            echo '🚨 Build or Test Failed! Pipeline aborted.'
        }
    }
}
