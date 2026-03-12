pipeline {
    agent any

    environment {
        // --- CONFIGURATION ---
        DOCKER_REGISTRY = "docker.io" // Change this if using private registry
        DOCKER_IMAGE    = "awoke/student-app" // Change to your docker image name
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
        NAMESPACE       = "student-app"
        KUBECONFIG_CREDENTIAL_ID = "kubeconfig" // Jenkins credential ID for your Kubeconfig file
        DOCKER_HUB_CREDENTIAL_ID = "docker-hub-credentials" // Jenkins credential ID for Docker Hub
    }

    tools {
        nodejs 'node' // This name must match what you configure in "Global Tool Configuration"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Running build/lint (placeholder)...'
                // sh 'npm run lint'
                // sh 'npm test'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_HUB_CREDENTIAL_ID) {
                        def customImage = docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}")
                        customImage.push()
                        customImage.push("latest")
                    }
                }
            }
        }

   stage('Deploy to Kubernetes') {
    steps {
        script {
            echo "Deploying to Kubernetes namespace: ${NAMESPACE}"

            // Use the kubeconfig mounted inside the Jenkins container
            sh """
                export KUBECONFIG=/root/.kube/config
                kubectl --insecure-skip-tls-verify=true set image deployment/student-app \
                    student-app=${DOCKER_IMAGE}:${IMAGE_TAG} -n ${NAMESPACE}
                kubectl --insecure-skip-tls-verify=true apply -f k8s/ -n ${NAMESPACE}
                kubectl --insecure-skip-tls-verify=true rollout status deployment/student-app -n ${NAMESPACE}
            """
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
    }
}
