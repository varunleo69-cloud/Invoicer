pipeline {
    agent any

    environment {
        APP_NAME = "Invoicer"
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
                    # Stop and remove older version if running
                    docker stop $APP_NAME || true
                    docker rm $APP_NAME || true

                    # Start fresh container instance
                    docker run -d --name $APP_NAME -p $CONTAINER_PORT:3000 $APP_NAME:latest
                '''
            }
        }

        stage('Smoke Test Deployment') {
            steps {
                echo '🔍 Verifying deployment health...'
                sh 'sleep 3'
                sh 'curl -f http://localhost:3000/health || exit 1'
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment complete! App is live at http://localhost:3000'
        }
        failure {
            echo '🚨 Build or Test Failed! Pipeline aborted.'
        }
    }
}
