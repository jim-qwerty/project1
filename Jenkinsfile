pipeline {
  agent any

  environment {
    APP_ENV          = 'testing'
    CACHE_DRIVER     = 'array'
    QUEUE_CONNECTION = 'sync'
    DB_CONNECTION    = 'sqlite'
    DB_DATABASE      = 'database/database.sqlite'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Deps PHP (Docker Hub)') {
      steps {
        sh '''
          set -e
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY"

          # 1) Ejecutamos como root para poder instalar extensiones
          docker run --rm $proxyEnv -v "$PWD":/app -w /app php:8.2-cli bash -lc '
            set -eux

            php -v

            # Paquetes necesarios para compilar extensiones y utilidades
            apt-get update
            apt-get install -y --no-install-recommends \
              libsqlite3-dev libzip-dev unzip git

            # Habilitar PDO SQLite (necesario para usar SQLite en Laravel)
            docker-php-ext-configure pdo_sqlite
            docker-php-ext-install pdo_sqlite

            # Instalar Composer de forma estándar y verificada
            EXPECTED_CHECKSUM="$(php -r "copy(\"https://composer.github.io/installer.sig\", \"php://stdout\");")"
            php -r "copy(\"https://getcomposer.org/installer\", \"composer-setup.php\");"
            ACTUAL_CHECKSUM="$(php -r "echo hash_file(\"sha384\", \"composer-setup.php\");")"
            [ "$EXPECTED_CHECKSUM" = "$ACTUAL_CHECKSUM" ] || { echo "ERROR: Invalid composer installer checksum"; exit 1; }
            php composer-setup.php --install-dir=/usr/local/bin --filename=composer
            rm -f composer-setup.php

            composer --version
            composer install --no-interaction --prefer-dist --no-progress
          '

          # 2) Reparar permisos del workspace (para que no quede todo como root)
          uid=$(id -u); gid=$(id -g)
          docker run --rm -v "$PWD":/app alpine sh -lc "chown -R $uid:$gid /app"
        '''
      }
    }

    stage('Config testing + DB') {
      steps {
        sh '''
          set -e
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY"

          docker run --rm $proxyEnv -v "$PWD":/app -w /app php:8.2-cli bash -lc '
            set -eux
            apt-get update
            apt-get install -y --no-install-recommends libsqlite3-dev
            docker-php-ext-configure pdo_sqlite
            docker-php-ext-install pdo_sqlite

            cp -n .env.example .env.testing || true
            mkdir -p database
            rm -f database/database.sqlite && : > database/database.sqlite

            php artisan key:generate --env=testing --force
            php artisan migrate      --env=testing --force
            php artisan db:seed      --env=testing --force || true
          '

          uid=$(id -u); gid=$(id -g)
          docker run --rm -v "$PWD":/app alpine sh -lc "chown -R $uid:$gid /app"
        '''
      }
    }

    stage('Tests') {
      steps {
        sh '''
          set +e
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY"

          docker run --rm $proxyEnv -v "$PWD":/app -w /app php:8.2-cli bash -lc '
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

          uid=$(id -u); gid=$(id -g)
          docker run --rm -v "$PWD":/app alpine sh -lc "chown -R $uid:$gid /app"

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
          set -e
          proxyEnv="-e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY -e NO_PROXY=$NO_PROXY"

          docker run --rm --user $(id -u):$(id -g) $proxyEnv \
            -v "$PWD":/workspace -w /workspace node:20 bash -lc "
              set -eux
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
