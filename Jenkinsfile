pipeline {
    agent any

    environment {
        // --- CONFIGURATION ---
        DOCKER_REGISTRY          = "docker.io"                  // or your private registry
        DOCKER_IMAGE             = "awoke/student-app"          // your Docker Hub image
        IMAGE_TAG                = "${env.BUILD_NUMBER}"
        NAMESPACE                = "student-app"
        KUBECONFIG_CREDENTIAL_ID = "kubeconfig"                 // your Secret file credential ID
        DOCKER_HUB_CREDENTIAL_ID = "dockerhub-credentials"      // your Docker Hub username/password credential
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                nodejs(nodeJSInstallationName: 'node') {   // ← exact name from your config ("node")
                    sh 'npm ci'                            // 'ci' preferred in CI for reproducible installs
                }
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Running build/lint/test (placeholder)...'
                nodejs(nodeJSInstallationName: 'node') {
                    // Adjust to your actual scripts in package.json
                    sh 'npm run build'     // example - uncomment/change as needed
                    // sh 'npm run lint'
                    // sh 'npm test'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    echo "Building & pushing Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_HUB_CREDENTIAL_ID) {
                        def customImage = docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}")
                        customImage.push()          // push the build number tag
                        customImage.push("latest")  // optional: update :latest
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
                            # No need for manual export KUBECONFIG – the credential binding handles it
                            # Avoid --insecure-skip-tls-verify in production (your token-based config should work without it)

                            kubectl set image deployment/student-app \
                                student-app=${DOCKER_IMAGE}:${IMAGE_TAG} -n ${NAMESPACE}

                            kubectl apply -f k8s/ -n ${NAMESPACE}   # assumes manifests in k8s/ folder

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
            // Optional cleanup: remove temporary Docker images on the agent
            sh 'docker system prune -f || true'
        }
    }
}