pipeline {
    agent any

    environment {

        REGISTRY = "ghcr.io" // ghcr.io/OWNER/IMAGE_NAME:TAG

        REGISTRY_IMAGE = "ghcr.io/rino21/presence"

        REGISTRY_USER = credentials('registry-user')

        REGISTRY_PASSWORD = credentials('registry-password')
        
        DEPLOYEMENT_USER = "rino"
        
        DEPLOYEMENT_IP = "192.168.40.137"

        PATH_COMPOSE = "/home/rino/project/presence"

        // 👇 AJOUT : Configuration Trivy
        TRIVY_SERVER = "http://192.168.40.138:4954"
        // TRIVY_SEVERITY = "CRITICAL"
        TRIVY_SEVERITY = "CRITICAL,HIGH"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'

                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=presence \
                              -Dsonar.sources=. \
                              -Dsonar.exclusions=node_modules/**,coverage/**,dist/**,build/**,trivy*
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // =========================================================
        // 👇 AJOUT : SCAN TRIVY DU CODE SOURCE (fs)
        // =========================================================
        stage('Trivy Scan - Filesystem') {
            steps {
                sh '''
                    trivy fs \
                      --server ${TRIVY_SERVER} \
                      --severity ${TRIVY_SEVERITY} \
                      --exit-code 1 \
                      --no-progress \
                      --skip-version-check \
                      .
                '''
            }
        }

        // =========================================================
        // BUILD FRONT
        // =========================================================
        stage('Build Front Staging') {

            when {
                anyOf{
                    changeset "presence-front/**"
                    changeset "Jenkinsfile-sonar-trivy"
                }
            }

            steps {

                sh '''
                    set -e

                    echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
                    -u "$REGISTRY_USER" \
                    --password-stdin

                    docker build \
                    -t $REGISTRY_IMAGE/staging/front:dev \
                    -f presence-front/Dockerfile \
                    presence-front/

                    docker push \
                    $REGISTRY_IMAGE/staging/front:dev

                    docker logout $REGISTRY
                '''
            }
        }

        // =========================================================
        // 👇 AJOUT : SCAN TRIVY DE L'IMAGE FRONT
        // =========================================================
        stage('Trivy Scan - Front Image') {
            when {
                anyOf {
                    changeset "presence-front/**"
                    changeset "Jenkinsfile-sonar-trivy"
                }
            }
            steps {
                sh '''
                    trivy image \
                      --server ${TRIVY_SERVER} \
                      --severity ${TRIVY_SEVERITY} \
                      --exit-code 1 \
                      --no-progress \
                      --skip-version-check \
                      ${REGISTRY_IMAGE}/staging/front:dev
                '''
            }
        }

        // =========================================================
        // BUILD API
        // =========================================================
        stage('Build API Staging') {

            when {
                anyOf {
                    changeset "presence-api/**"
                    changeset "Jenkinsfile-sonar-trivy"
                }
            }

            steps {

                sh '''
                    set -e

                    echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
                    -u "$REGISTRY_USER" \
                    --password-stdin

                    docker build \
                    -t $REGISTRY_IMAGE/staging/api:dev \
                    -f presence-api/Dockerfile \
                    presence-api/

                    docker push \
                    $REGISTRY_IMAGE/staging/api:dev

                    docker logout $REGISTRY
                '''
            }
        }

        // =========================================================
        // 👇 AJOUT : SCAN TRIVY DE L'IMAGE API
        // =========================================================
        stage('Trivy Scan - API Image') {
            when {
                anyOf {
                    changeset "presence-api/**"
                    changeset "Jenkinsfile-sonar-trivy"
                }
            }
            steps {
                sh '''
                    trivy image \
                      --server ${TRIVY_SERVER} \
                      --severity ${TRIVY_SEVERITY} \
                      --exit-code 1 \
                      --no-progress \
                      --skip-version-check \
                      ${REGISTRY_IMAGE}/staging/api:dev
                '''
            }
        }

        // =========================================================
        // DEPLOY
        // =========================================================
        stage('Deploy Staging') {

            when {
                expression { env.GIT_BRANCH == 'origin/main' }
            }

            steps {
                sshagent(credentials: ['ssh-private-key']) {
                    sh """
                        scp -o StrictHostKeyChecking=no docker-compose-dev.yml \\
                            ${DEPLOYEMENT_USER}@${DEPLOYEMENT_IP}:${PATH_COMPOSE}/docker-compose.yml

                        ssh -o StrictHostKeyChecking=no \\
                            ${DEPLOYEMENT_USER}@${DEPLOYEMENT_IP} '
                                set -e
                                cd ${PATH_COMPOSE}
                                echo "'\$REGISTRY_PASSWORD'" | docker login "'\$REGISTRY'" -u "'\$REGISTRY_USER'" --password-stdin
                                docker compose -f docker-compose.yml pull
                                docker compose -f docker-compose.yml up -d
                                docker logout "'\$REGISTRY'"
                            '
                    """
                }
            }
        }
    }
}