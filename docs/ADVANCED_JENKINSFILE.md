# Advanced Jenkinsfile Examples

This file contains advanced Jenkinsfile configurations for different CI-CD scenarios.

## Example 1: Multi-Branch Pipeline with Notifications

```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Select browser')
        booleanParam(name: 'RUN_HEADED', defaultValue: false, description: 'Run tests in headed mode')
    }

    environment {
        NODE_ENV = 'ci'
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out from branch: ${env.BRANCH_NAME}"
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
                sh 'npx playwright install ${BROWSER}'
            }
        }

        stage('Lint & Format') {
            steps {
                echo 'Running code quality checks...'
                sh 'npm run lint || true'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def headedFlag = params.RUN_HEADED ? '--headed' : ''
                    sh "npm run test ${headedFlag} -- --project=${BROWSER}"
                }
            }
        }

        stage('Generate Report') {
            steps {
                sh 'npm run test:report || true'
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])

            junit testResults: 'test-results/**/*.xml', 
                   allowEmptyResults: true

            archiveArtifacts artifacts: 'screenshots/**/*.png,videos/**/*.webm', 
                            allowEmptyArchive: true
        }

        success {
            echo '✅ Pipeline succeeded!'
            
            // Slack notification
            slackSend(
                color: 'good',
                message: "✅ ${JOB_NAME} #${BUILD_NUMBER} - PASSED\n${BUILD_URL}"
            )
        }

        failure {
            echo '❌ Pipeline failed!'
            
            // Slack notification
            slackSend(
                color: 'danger',
                message: "❌ ${JOB_NAME} #${BUILD_NUMBER} - FAILED\n${BUILD_URL}"
            )

            // Email notification
            emailext(
                subject: "❌ Test Failure: ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
                    Build failed: ${BUILD_URL}
                    Check the attached report for details.
                """,
                to: '${DEFAULT_RECIPIENTS}'
            )
        }

        unstable {
            echo '⚠️ Pipeline unstable - some tests may have failed'
        }

        cleanup {
            deleteDir()
        }
    }
}
```

## Example 2: Parallel Execution Across Multiple Browsers

```groovy
pipeline {
    agent any

    environment {
        NODE_ENV = 'ci'
        CI = 'true'
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Setting up environment...'
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Run Tests - Parallel Browsers') {
            parallel {
                stage('Chrome') {
                    agent any
                    steps {
                        echo 'Running tests on Chromium...'
                        sh 'npm run test -- --project=chromium'
                    }
                }

                stage('Firefox') {
                    agent any
                    steps {
                        echo 'Running tests on Firefox...'
                        sh 'npm run test -- --project=firefox'
                    }
                }

                stage('Safari') {
                    agent any
                    steps {
                        echo 'Running tests on WebKit...'
                        sh 'npm run test -- --project=webkit'
                    }
                }
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true
            ])

            junit testResults: 'test-results/**/*.xml', 
                   allowEmptyResults: true

            archiveArtifacts artifacts: '**/*.png,**/*.webm', 
                            allowEmptyArchive: true
        }
    }
}
```

## Example 3: Scheduled Nightly Tests with Performance Metrics

```groovy
pipeline {
    agent any

    triggers {
        cron('H 2 * * *') // Run daily at 2 AM
    }

    environment {
        NODE_ENV = 'ci'
        CI = 'true'
    }

    stages {
        stage('Prepare') {
            steps {
                echo 'Preparing for nightly test run...'
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Run Full Test Suite') {
            steps {
                echo 'Running complete test suite...'
                timeout(time: 1, unit: 'HOURS') {
                    sh '''
                        npm run test -- \
                            --reporter=junit \
                            --reporter=html \
                            --reporter=json
                    '''
                }
            }
        }

        stage('Generate Performance Report') {
            steps {
                echo 'Analyzing performance metrics...'
                sh '''
                    node scripts/analyze-performance.js
                '''
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Nightly Test Report',
                keepAll: true
            ])

            junit testResults: 'test-results/**/*.xml', 
                   allowEmptyResults: true

            // Plot test execution trends
            plot csvFileName: 'test-metrics.csv',
                 csvSeries: [[
                     displayTableFlag: true,
                     exclusionValues: '',
                     file: 'test-metrics.csv',
                     inclusionFlag: 'OFF',
                     url: ''
                 ]],
                 group: 'Performance Metrics',
                 numBuilds: '50',
                 style: 'line',
                 title: 'Test Execution Time Trend'
        }

        success {
            echo '✅ Nightly tests passed!'
            slackSend(
                channel: '#qa-team',
                color: 'good',
                message: "✅ Nightly tests completed successfully!\n${BUILD_URL}"
            )
        }

        failure {
            echo '❌ Nightly tests failed!'
            slackSend(
                channel: '#qa-team',
                color: 'danger',
                message: "❌ Nightly tests failed!\n${BUILD_URL}"
            )
        }
    }
}
```

## Example 4: Triggered by GitHub Pull Requests

```groovy
pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        NODE_ENV = 'ci'
        CI = 'true'
    }

    stages {
        stage('Checkout PR') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_MSG = sh(
                        script: "git log -1 --pretty=%B",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Run PR Tests') {
            steps {
                echo "Running tests for PR: ${env.CHANGE_TITLE}"
                sh 'npm run test:ci'
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'PR Test Report',
                keepAll: true
            ])

            junit testResults: 'test-results/**/*.xml', 
                   allowEmptyResults: true
        }

        success {
            echo '✅ PR tests passed!'
            githubNotify(
                status: 'SUCCESS',
                description: 'All tests passed!',
                context: 'CI/CD Pipeline'
            )
        }

        failure {
            echo '❌ PR tests failed!'
            githubNotify(
                status: 'FAILURE',
                description: 'Tests failed. Check logs.',
                context: 'CI/CD Pipeline'
            )
        }
    }
}
```

## Example 5: Docker-based Execution

```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-focal'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        NODE_ENV = 'ci'
        CI = 'true'
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Setting up Docker environment...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests in Docker container...'
                sh 'npm run test:ci'
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Test Report',
                keepAll: true
            ])

            junit testResults: 'test-results/**/*.xml', 
                   allowEmptyResults: true
        }
    }
}
```

---

Choose the example that best fits your CI-CD needs and customize accordingly!
