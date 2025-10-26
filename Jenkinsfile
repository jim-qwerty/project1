// =======================
// MÓDULOS (helpers)
// =======================
def inDocker(image, args='-u 0:0', body) {
  docker.image(image).inside(args) { body() }
}

def mod_prepareEnv = {
  sh '''
    set -e
    # DB SQLite
    mkdir -p database
    [ -f database/database.sqlite ] || touch database/database.sqlite
    chmod 666 database/database.sqlite || true

    # .env resiliente
    if [ ! -f .env ]; then
      if [ -f .env.example ]; then
        cp .env.example .env
      else
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

def mod_composerInstall = {
  inDocker('composer:2') {
    sh '''
      set -e
      test -f composer.json || { echo "composer.json no existe"; exit 1; }
      composer validate --no-check-publish || true
      composer install --prefer-dist --no-progress --no-scripts --no-ansi
    '''
  }
}

def mod_nodeBuild = {
  inDocker('node:18') {
    sh '''
      set -e
      node -v && npm -v
      if [ -f package-lock.json ]; then
        npm ci
      elif [ -f package.json ]; then
        npm install
      else
        echo "No hay package.json; nada que instalar."
        exit 0
      fi
      npm run -s build || echo "No hay script build, continúo…"
    '''
  }
}

def mod_laravelMigrate = {
  inDocker('ghcr.io/shivammathur/php:8.2') {
    sh '''
      set -e
      php -v
      php -m | grep -i sqlite || (echo "Falta sqlite en PHP" && exit 1)

      # Key & caches
      php -r "file_exists('.env') || copy('.env.example', '.env');"
      php artisan key:generate --force
      php artisan config:clear
      php artisan cache:clear
      php artisan route:clear

      # Migraciones (seed opcional)
      php artisan migrate --force
      php artisan db:seed --force || echo "Sin seeders, continúo…"
    '''
  }
}

def mod_runTests = {
  inDocker('ghcr.io/shivammathur/php:8.2') {
    sh '''
      set -e
      mkdir -p build/test-results
      php artisan test --log-junit build/test-results/junit.xml
    '''
  }
}

// =======================
// PIPELINE DECLARATIVO
// =======================
pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    // Laravel testing
    APP_ENV = 'testing'
    APP_DEBUG = 'false'
    DB_CONNECTION = 'sqlite'
    DB_DATABASE   = 'database/database.sqlite'

    CACHE_DRIVER     = 'array'
    SESSION_DRIVER   = 'array'
    QUEUE_CONNECTION = 'sync'

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

    stage('Módulo: Preparar entorno (.env + SQLite)') {
      steps { script { mod_prepareEnv() } }
    }

    stage('Módulo: Composer install') {
      steps { script { mod_composerInstall() } }
    }

    stage('Módulo: Node build (si aplica)') {
      when { expression { fileExists('package-lock.json') || fileExists('package.json') } }
      steps { script { mod_nodeBuild() } }
    }

    stage('Módulo: Laravel migrate') {
      steps { script { mod_laravelMigrate() } }
    }

    stage('Módulo: Tests (JUnit)') {
      steps { script { mod_runTests() } }
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
    always  { script { deleteDir() } }
  }
}
