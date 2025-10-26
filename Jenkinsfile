pipeline {
  agent any
  options {
    timestamps()
    ansiColor('xterm')
    disableConcurrentBuilds()
  }

  environment {
    # Modo testing (sin tocar prod)
    APP_ENV = 'testing'
    APP_DEBUG = 'false'

    # Base de datos SQLite en archivo (dentro del repo)
    DB_CONNECTION = 'sqlite'
    DB_DATABASE   = 'database/database.sqlite'

    # Evita servicios externos durante pruebas
    CACHE_DRIVER  = 'array'
    QUEUE_CONNECTION = 'sync'
    SESSION_DRIVER = 'array'

    # Evita prompts interactivos
    COMPOSER_NO_INTERACTION = '1'
    NPM_CONFIG_FUND = 'false'
    NPM_CONFIG_AUDIT = 'false'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'php -v || true' // Para log (si php no está en el nodo, no falla)
      }
    }

    stage('Preparar entorno') {
      steps {
        sh '''
          # Copiar .env si no existe
          [ -f .env ] || cp .env.example .env

          # Asegurar carpeta database/ y archivo sqlite
          mkdir -p database
          [ -f database/database.sqlite ] || touch database/database.sqlite
        '''
      }
    }

    stage('Instalar Composer deps') {
      steps {
        script {
          docker.image('composer:2').inside('-u 0:0') {
            sh '''
              composer --version
              composer install \
                --prefer-dist \
                --no-progress \
                --no-scripts
            '''
          }
        }
      }
    }

    stage('Instalar Node deps (opcional build)') {
      steps {
        script {
          docker.image('node:18').inside('-u 0:0') {
            sh '''
              node -v && npm -v
              # Si no tienes frontend, esto igual validará package.json sin romper
              npm ci || npm install
              # Ejecuta build si existe el script "build"; si no, lo ignora
              npm run -s build || echo "No hay script build, continúo…"
            '''
          }
        }
      }
    }

    stage('Migraciones + Tests') {
      steps {
        script {
          /*
            Usamos una imagen PHP lista para CI con extensiones comunes.
            La oficial php:8.2-cli a veces no trae sqlite habilitado por defecto.
            Esta imagen trae pdo_sqlite activo y composer preinstalado.
          */
          def phpImage = 'ghcr.io/shivammathur/php:8.2'
          docker.image(phpImage).inside('-u 0:0') {
            sh '''
              php -v
              php -m | grep -i sqlite || (echo "Falta sqlite en PHP" && exit 1)

              # Generar APP_KEY, limpiar caches
              php -r "file_exists('.env') || copy('.env.example', '.env');"
              php artisan key:generate --force
              php artisan config:clear
              php artisan cache:clear
              php artisan route:clear

              # Ejecutar migraciones sobre SQLite
              php artisan migrate --force

              # Correr pruebas y emitir reporte JUnit para Jenkins
              mkdir -p build/test-results
              if php artisan test --log-junit build/test-results/junit.xml; then
                echo "Tests OK"
              else
                echo "Tests con fallos"; exit 1
              fi
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

  } // stages

  post {
    success {
      echo '✅ Pipeline OK'
    }
    failure {
      echo '❌ Pipeline falló. Revisa logs y junit.'
    }
    always {
      cleanWs(cleanWhenAborted: true, deleteDirs: true)
    }
  }
}
