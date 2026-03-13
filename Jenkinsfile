pipeline {
    agent any

    environment {
        DOCKER_REGISTRY          = "docker.io"
        DOCKER_IMAGE             = "awoke/student-app"
        IMAGE_TAG                = "${env.BUILD_NUMBER}"
        NAMESPACE                = "student-app"
        KUBECONFIG_CREDENTIAL_ID = "minikube-kubeconfig"
        DOCKER_HUB_CREDENTIAL_ID = "dockerhub-credentials"
    }
//kdfnvjkfnvjfknv
    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                nodejs(nodeJSInstallationName: 'node') {
                    sh 'npm ci'
                }
            }
        }

        stage('Verify App') {
            steps {
                echo 'Verifying app (start in background and check endpoints)...'
                nodejs(nodeJSInstallationName: 'node') {
                    // Optional: quick smoke test – start server briefly and curl localhost
                    // (not required for pure API, but useful)
                    sh '''
                        echo "Skipping full tests for now – pure API with no build/transpile step"
                        # Optional example if you add tests later:
                        # npm test
                    '''
                }
            }
        }

   stage('Docker Build & Push') {
    steps {
        script {
            echo "Building & pushing Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
            docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIAL_ID) {
                def customImage = docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}")
                customImage.push()          // pushes :${BUILD_NUMBER}
                customImage.push('latest')  // also pushes :latest
            }
        }
    }
}

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes namespace: ${NAMESPACE}"
                    withCredentials([file(credentialsId: KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG')]) {
                        sh """
                            kubectl set image deployment/student-app \
                                student-app=${DOCKER_IMAGE}:${IMAGE_TAG} -n ${NAMESPACE}

                            kubectl apply -f k8s/ -n ${NAMESPACE}

                            kubectl rollout status deployment/student-app \
                                -n ${NAMESPACE} \
                                --timeout=120s
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment of version ${IMAGE_TAG} succeeded!"
        }
        failure {
            echo "❌ Build or Deployment failed. Check the logs."
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}