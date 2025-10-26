pipeline {
  agent any

  environment {
    APP_ENV          = 'testing'
    CACHE_DRIVER     = 'array'
    QUEUE_CONNECTION = 'sync'

    // Usaremos SQLite en CI (no necesitas MySQL/XAMPP)
    DB_CONNECTION = 'sqlite'
    DB_DATABASE   = 'database/database.sqlite'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Deps PHP (en contenedor)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app ghcr.io/shivammathur/php:8.2 bash -lc '
            set -e
            php -v
            if ! command -v composer >/dev/null 2>&1; then
              php -r "copy(\\"https://getcomposer.org/installer\\",\\"composer-setup.php\\");"
              php composer-setup.php --install-dir=/usr/local/bin --filename=composer
            fi
            composer install --no-interaction --prefer-dist --no-progress
          '
        '''
      }
    }

    stage('Config testing + DB (en contenedor)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app ghcr.io/shivammathur/php:8.2 bash -lc '
            set -e
            cp -n .env.example .env.testing || true
            mkdir -p database
            rm -f database/database.sqlite && touch database/database.sqlite

            php artisan key:generate --env=testing --force
            php artisan migrate      --env=testing --force
            php artisan db:seed      --env=testing --force || true
          '
        '''
      }
    }

    stage('Tests (en contenedor)') {
      steps {
        sh '''
          set +e
          docker run --rm -v "$PWD":/app -w /app ghcr.io/shivammathur/php:8.2 bash -lc '
            set -e
            if [ -f phpunit.xml ] || [ -f phpunit.xml.dist ]; then
              ./vendor/bin/phpunit --log-junit junit.xml --testdox || php artisan test --without-tty
            else
              php artisan test --without-tty
            fi
          '
          status=$?
          set -e
          exit $status
        '''
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'junit.xml, tests/**/junit*.xml, build/test-results/**/*.xml'
        }
      }
    }

    stage('Build Frontend (opcional)') {
      when { expression { return fileExists('package.json') } }
      steps {
        sh '''
          docker run --rm -v "$PWD":/workspace -w /workspace node:20 bash -lc "
            set -e
            corepack enable || true
            npm ci || npm install
            npm run build || npm run dev --if-present
          "
        '''
      }
    }
  }

  options {
    timeout(time: 20, unit: 'MINUTES')
  }
}
