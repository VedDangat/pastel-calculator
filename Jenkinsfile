pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }

    triggers {
        // Jenkins checks GitHub every few minutes, so a pushed change starts a build.
        pollSCM('H/2 * * * *')
    }

    environment {
        // Replace this with your Docker Hub username/repository before the first run.
        IMAGE_REPO = 'REPLACE_WITH_DOCKERHUB_USERNAME/pastel-calculator'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                sh '''
                    set -eu
                    test -s index.html
                    test -s style.css
                    test -s script.js
                    test -s notebook.jpg
                    docker run --rm -v "$WORKSPACE:/src" -w /src node:22-alpine node --check script.js
                '''
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        set -eu
                        printf '%s' "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USERNAME" --password-stdin
                        docker build \
                            --tag "$IMAGE_REPO:$BUILD_NUMBER" \
                            --tag "$IMAGE_REPO:latest" .
                        docker push "$IMAGE_REPO:$BUILD_NUMBER"
                        docker push "$IMAGE_REPO:latest"
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                sh '''
                    set -eu
                    minikube status
                    kubectl apply -f k8s/service.yaml
                    sed "s|__IMAGE__|$IMAGE_REPO:$BUILD_NUMBER|g" k8s/deployment.yaml | kubectl apply -f -
                    kubectl rollout status deployment/pastel-calculator --timeout=180s
                    kubectl wait --for=condition=available deployment/pastel-calculator --timeout=180s
                    kubectl get pods,deployments,services -o wide
                '''
            }
        }
    }

    post {
        success {
            echo "Build ${BUILD_NUMBER} deployed as ${IMAGE_REPO}:${BUILD_NUMBER}"
        }
        always {
            echo 'Pipeline finished. Review the stage logs above for details.'
        }
    }
}
