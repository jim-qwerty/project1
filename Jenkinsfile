pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'mkdir -p build'
      }
    }

    stage('Backend - Pest (Laravel)') {
      when { expression { fileExists('composer.json') } }
      steps {
        sh '''
          composer install --no-interaction --prefer-dist

          # .env mínimo para tests (APP_KEY + SQLite en memoria)
          if [ -f artisan ]; then
            KEY=$(php -r "echo 'base64:'.base64_encode(random_bytes(32));")
            cat > .env <<EOF
APP_ENV=testing
APP_KEY=$KEY
APP_DEBUG=true
APP_URL=http://localhost
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
CACHE_DRIVER=array
QUEUE_CONNECTION=sync
SESSION_DRIVER=array
MAIL_MAILER=array
EOF
          fi

          # Ejecuta Pest o PHPUnit y genera reporte JUnit
          if [ -f vendor/bin/pest ]; then
            vendor/bin/pest --log-junit build/pest.xml || true
          elif [ -f vendor/bin/phpunit ]; then
            vendor/bin/phpunit --log-junit build/phpunit.xml || true
          else
            echo "No se encontró Pest ni PHPUnit."
          fi
        '''
      }
      post {
        always {
          script {
            if (fileExists('build/pest.xml')) {
              junit allowEmptyResults: true, testResults: 'build/pest.xml'
            } else if (fileExists('build/phpunit.xml')) {
              junit allowEmptyResults: true, testResults: 'build/phpunit.xml'
            } else {
              echo 'No se generó reporte JUnit en backend.'
            }
          }
        }
      }
    }

    stage('Frontend - npm & Jest') {
      when { expression { fileExists('package.json') } }
      steps {
        sh '''
          npm ci || npm install
          npx --yes jest-junit || npm i -D jest-junit || true
          JEST_JUNIT_OUTPUT=./junit.xml npx jest --ci --passWithNoTests \
            --reporters=default --reporters=jest-junit || true
        '''
      }
      post {
        always {
          script {
            if (fileExists('junit.xml')) {
              junit allowEmptyResults: true, testResults: 'junit.xml'
            } else {
              echo 'No se generó junit.xml en frontend.'
            }
          }
        }
      }
    }
  }
}
