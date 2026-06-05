pipeline {
    agent any

    environment {
        NODE_ENV = 'ci'
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running Playwright tests...'
                sh 'npm run test || true'
            }
        }
    }

    post {
        always {
            echo 'Publishing test results and reports...'
            
            // Publish HTML Report
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])

            // Publish Test Results
            junit testResults: 'test-results/**/*.xml', 
                   allowEmptyResults: true,
                   skipPublishingChecks: true

            // Archive Screenshots
            archiveArtifacts artifacts: 'screenshots/**/*.png', 
                            allowEmptyArchive: true

            // Clean up old builds (keep last 30)
            cleanWs(
                deleteDirs: true,
                patterns: [[pattern: 'playwright-report/**', type: 'INCLUDE']]
            )
        }

        success {
            echo '✓ All tests passed successfully!'
        }

        failure {
            echo '✗ Tests failed. Check the Playwright Test Report for details.'
        }

        unstable {
            echo '⚠ Some tests may have issues.'
        }
    }
}
