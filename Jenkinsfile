pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    // Laravel en modo testing
    APP_ENV = 'testing'
    APP_DEBUG = 'false'

    // DB SQLite (archivo en el workspace)
    DB_CONNECTION = 'sqlite'
    DB_DATABASE   = 'database/database.sqlite'

    // Evitar dependencias externas en CI
    CACHE_DRIVER      = 'array'
    SESSION_DRIVER    = 'array'
    QUEUE_CONNECTION  = 'sync'

    // No interacción en herramientas
    COMPOSER_NO_INTERACTION = '1'
    NPM_CONFIG_FUND  = 'false'
    NPM_CONFIG_AUDIT = 'false'
    CI = 'true'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'ls -la || true'
      }
    }

    stage('Preparar entorno (.env y SQLite)') {
      steps {
        sh '''
          set -e
          # Crear DB SQLite
          mkdir -p database
          [ -f database/database.sqlite ] || touch database/database.sqlite
          chmod 666 database/database.sqlite || true

          # Si no existe .env:
          if [ ! -f .env ]; then
            if [ -f .env.example ]; then
              cp .env.example .env
            else
              # Generar .env mínimo de testing
              cat > .env <<'EOF'
APP_NAME=Laravel
APP_ENV=testing
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_LEVEL=warning

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

CACHE_DRIVER=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync

BROADCAST_DRIVER=log
MAIL_MAILER=log
EOF
            fi
          fi
        '''
      }
    }

    stage('Composer: validate & install') {
      steps {
        script {
          docker.image('composer:2').inside('-u 0:0') {
            sh '''
              set -e
              test -f composer.json || { echo "composer.json no existe"; exit 1; }
              composer validate --no-check-publish || true
              composer install --prefer-dist --no-progress --no-scripts --no-ansi
            '''
          }
        }
      }
    }

    stage('Node: ci & build (si aplica)') {
      when {
        expression { return fileExists('package-lock.json') || fileExists('package.json') }
      }
      steps {
        script {
          docker.image('node:18').inside('-u 0:0') {
            sh '''
              set -e
              node -v && npm -v
              if [ -f package-lock.json ]; then npm ci; elif [ -f package.json ]; then npm install; fi
              npm run -s build || echo "No hay script build, continúo…"
            '''
          }
        }
      }
    }

    stage('Laravel: key, cache & migrate') {
      steps {
        script {
          // Imagen PHP con pdo_sqlite habilitado
          def phpImage = 'ghcr.io/shivammathur/php:8.2'
          docker.image(phpImage).inside('-u 0:0') {
            sh '''
              set -e
              php -v
              php -m | grep -i sqlite || (echo "Falta sqlite en PHP" && exit 1)

              # Asegurar .env y APP_KEY
              php -r "file_exists('.env') || copy('.env.example', '.env');"
              php artisan key:generate --force

              # Limpiar caches antes de probar
              php artisan config:clear
              php artisan cache:clear
              php artisan route:clear

              # Migraciones (seed opcional)
              php artisan migrate --force
              php artisan db:seed --force || echo "Sin seeders, continuo…"
            '''
          }
        }
      }
    }

    stage('Tests (JUnit report)') {
      steps {
        script {
          def phpImage = 'ghcr.io/shivammathur/php:8.2'
          docker.image(phpImage).inside('-u 0:0') {
            sh '''
              set -e
              mkdir -p build/test-results
              # PHPUnit/Pest vía artisan con reporte JUnit
              php artisan test --log-junit build/test-results/junit.xml
            '''
          }
        }
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'build/test-results/*.xml'
          archiveArtifacts artifacts: 'build/test-results/*.xml,storage/logs/*.log', allowEmptyArchive: true
        }
      }
    }
  }

  post {
    success { echo '✅ CI OK: build estable y pruebas aprobadas' }
    failure { echo '❌ CI FALLÓ: revisa consola y reportes JUnit' }
    always  { script { deleteDir() } } // limpieza sin plugins extra
  }
}
