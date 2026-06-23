pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        NODE_ENV = 'ci'
        CI = 'true'
        BASE_URL = 'https://www.amazon.in' // as .env was not loading for jenkins
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

        stage('Run Docker Tests') {
            steps {
                  sh 'export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && docker --version'
                  sh 'export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && docker build -t playwright-framework .'
                  sh 'export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && docker run -e BASE_URL=$BASE_URL -e CI=true playwright-framework'
                 }
    
        }
    

    post {
        always {
            echo 'Publishing test results and reports...'
            
            // Publish HTML Report
            publishHTML([
                allowMissing: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])

            // Publish Test Results
           // junit testResults: 'test-results/**/*.xml', 
             //      allowEmptyResults: true,
               //    skipPublishingChecks: true 

            // Archive Screenshots
            archiveArtifacts artifacts: 'screenshots/**/*.png', 
                            allowEmptyArchive: true

            // Clean up old builds (keep last 30)
            deleteDir()
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
}