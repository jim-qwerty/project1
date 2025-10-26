pipeline {
  agent any

  environment {
    APP_ENV          = 'testing'
    CACHE_DRIVER     = 'array'
    QUEUE_CONNECTION = 'sync'
    DB_CONNECTION    = 'sqlite'
    DB_DATABASE      = 'database/database.sqlite'
  }

  options {
    timeout(time: 20, unit: 'MINUTES')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // 1) Instalar dependencias PHP con Composer (imagen oficial)
    stage('Composer install') {
      steps {
        sh '''
          set -e
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY"

          docker run --rm --user $(id -u):$(id -g) $proxyEnv \
            -v jenkins_home:/var/jenkins_home \
            -w "$WORKSPACE" \
            composer:2 sh -lc "
              composer --version
              composer install --no-interaction --prefer-dist --no-progress
            "
        '''
      }
    }

    // 2) Preparar entorno de testing + SQLite y migraciones
    stage('Config testing + DB') {
      steps {
        sh '''
          set -e
          export DEBIAN_FRONTEND=noninteractive
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY -e DEBIAN_FRONTEND=$DEBIAN_FRONTEND"

          # Ejecutamos como root para poder instalar extensiones
          docker run --rm $proxyEnv \
            -v jenkins_home:/var/jenkins_home \
            -w "$WORKSPACE" \
            php:8.2-cli bash -lc '
              set -eux
              apt-get update
              apt-get install -y --no-install-recommends libsqlite3-dev

              # Activar pdo_sqlite
              docker-php-ext-configure pdo_sqlite
              docker-php-ext-install pdo_sqlite

              # .env.testing + archivo SQLite
              cp -n .env.example .env.testing || true
              mkdir -p database
              rm -f database/database.sqlite && : > database/database.sqlite

              php artisan key:generate --env=testing --force
              php artisan migrate      --env=testing --force
              php artisan db:seed      --env=testing --force || true
            '

          # Reparar permisos del workspace (evita archivos root)
          uid=$(id -u); gid=$(id -g)
          docker run --rm -v jenkins_home:/var/jenkins_home alpine sh -lc "chown -R $uid:$gid '$WORKSPACE'"
        '''
      }
    }

    // 3) Ejecutar tests
    stage('Tests') {
      steps {
        sh '''
          set +e
          export DEBIAN_FRONTEND=noninteractive
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY -e DEBIAN_FRONTEND=$DEBIAN_FRONTEND"

          docker run --rm $proxyEnv \
            -v jenkins_home:/var/jenkins_home \
            -w "$WORKSPACE" \
            php:8.2-cli bash -lc '
              set -eux
              apt-get update
              apt-get install -y --no-install-recommends libsqlite3-dev
              docker-php-ext-configure pdo_sqlite
              docker-php-ext-install pdo_sqlite

              if [ -f phpunit.xml ] || [ -f phpunit.xml.dist ]; then
                ./vendor/bin/phpunit --log-junit junit.xml --testdox || php artisan test --without-tty
              else
                php artisan test --without-tty
              fi
            '
          status=$?
          set -e

          # Reparar permisos para que Jenkins pueda archivar/limpiar
          uid=$(id -u); gid=$(id -g)
          docker run --rm -v jenkins_home:/var/jenkins_home alpine sh -lc "chown -R $uid:$gid '$WORKSPACE'"

          exit $status
        '''
      }
      post {
        always {
          // Publica resultados si phpunit generó junit.xml
          junit allowEmptyResults: true, testResults: 'junit.xml, tests/**/junit*.xml, build/test-results/**/*.xml'
        }
      }
    }

    // 4) (Opcional) build del frontend si existe package.json
    stage('Build Frontend (opcional)') {
      when { expression { return fileExists('package.json') } }
      steps {
        sh '''
          set -e
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY"

          docker run --rm --user $(id -u):$(id -g) $proxyEnv \
            -v jenkins_home:/var/jenkins_home \
            -w "$WORKSPACE" \
            node:20 bash -lc "
              set -eux
              corepack enable || true
              npm ci || npm install
              npm run build || npm run dev --if-present
            "
        '''
      }
    }
  }
}
