pipeline {
    agent any

    stages {
        stage('Build and Push Frontend Image') {
            steps {
                script {
                   echo "Building frontend***"
                }
            }
        }

        stage('Build and Push Backend Image') {
            steps {
                script {
                    echo "Building backend**"
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}





