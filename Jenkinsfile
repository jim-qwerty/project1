pipeline {
  agent {
    docker {
      // Imagen con PHP 8.2 + Composer + extensiones comunes
      image 'ghcr.io/shivammathur/php:8.2'
      args  '-u 0' // root para poder instalar paquetes si hace falta
    }
  }

  environment {
    APP_ENV       = 'testing'
    APP_KEY       = ''                // se generará en el stage
    CACHE_DRIVER  = 'array'
    QUEUE_CONNECTION = 'sync'

    // Usaremos SQLite para CI (sin MySQL)
    DB_CONNECTION = 'sqlite'
    DB_DATABASE   = 'database/database.sqlite'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Deps PHP') {
      steps {
        sh '''
          php -v
          composer --version || EXPECTED=1
          if [ "$EXPECTED" = "1" ]; then \
            php -r "copy('https://getcomposer.org/installer','composer-setup.php');"
            php composer-setup.php --install-dir=/usr/local/bin --filename=composer
          fi
          composer install --no-interaction --prefer-dist --no-progress
        '''
      }
    }

    stage('Config testing + DB') {
      steps {
        sh '''
          # .env.testing con SQLite
          cp -n .env.example .env.testing || true
          # Asegurar archivo SQLite
          mkdir -p database
          rm -f database/database.sqlite
          touch database/database.sqlite

          # Clave de app para tests
          php artisan key:generate --env=testing --force

          # Migraciones + seeds (si existen)
          php artisan migrate --env=testing --force
          php artisan db:seed --env=testing --force || true
        '''
      }
    }

    stage('Tests PHP') {
      steps {
        sh '''
          # Usa PHPUnit o "artisan test", lo que tengas configurado
          if [ -f phpunit.xml ] || [ -f phpunit.xml.dist ]; then
            ./vendor/bin/phpunit --testdox || php artisan test --without-tty
          else
            php artisan test --without-tty
          fi
        '''
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'tests/**/junit*.xml, junit*.xml, build/test-results/**/*.xml'
        }
      }
    }

    // Opcional: build del frontend si el proyecto lo usa
    stage('Build Frontend (opcional)') {
      when { expression { return fileExists('package.json') } }
      agent { docker { image 'node:20' } }
      steps {
        sh '''
          corepack enable || true
          npm ci || npm install
          npm run build || npm run dev --if-present
        '''
      }
    }
  }

  options {
    // Mantén logs y tiempos razonables
    timeout(time: 15, unit: 'MINUTES')
  }
}
