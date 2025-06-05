<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Importa las clases DAO y Service
use App\DAOs\GradoDAO;
use App\Services\GradoService;

use App\DAOs\SeccionDAO;
use App\Services\SeccionService;

use App\DAOs\CursoDAO;
use App\Services\CursoService;

use App\DAOs\AlumnoDAO;
use App\Services\AlumnoService;

use App\DAOs\ApoderadoDAO;
use App\Services\ApoderadoService;

use App\DAOs\MatriculaDAO;
use App\Services\MatriculaService;

use App\DAOs\DocenteDAO;
use App\Services\DocenteService;

use App\DAOs\UsuarioDAO;
use App\Services\UsuarioService;

use App\DAOs\AsistenciaAlumnoDAO;
use App\Services\AsistenciaAlumnoService;

use App\DAOs\AsistenciaDocenteDAO;
use App\Services\AsistenciaDocenteService;

use App\DAOs\NotaDAO;
use App\Services\NotaService;

use App\DAOs\PagoDAO;
use App\Services\PagoService;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Binding GradoDAO → GradoService
        $this->app->bind(GradoDAO::class, function($app) {
            return new GradoDAO();
        });
        $this->app->bind(GradoService::class, function($app) {
            return new GradoService($app->make(GradoDAO::class));
        });

        // Binding SeccionDAO → SeccionService
        $this->app->bind(SeccionDAO::class, function($app) {
            return new SeccionDAO();
        });
        $this->app->bind(SeccionService::class, function($app) {
            return new SeccionService($app->make(SeccionDAO::class));
        });

        // Binding CursoDAO → CursoService
        $this->app->bind(CursoDAO::class, function($app) {
            return new CursoDAO();
        });
        $this->app->bind(CursoService::class, function($app) {
            return new CursoService($app->make(CursoDAO::class));
        });

        // Binding AlumnoDAO → AlumnoService
        $this->app->bind(AlumnoDAO::class, function($app) {
            return new AlumnoDAO();
        });
        $this->app->bind(AlumnoService::class, function($app) {
            return new AlumnoService($app->make(AlumnoDAO::class));
        });

        // Binding ApoderadoDAO → ApoderadoService
        $this->app->bind(ApoderadoDAO::class, function($app) {
            return new ApoderadoDAO();
        });
        $this->app->bind(ApoderadoService::class, function($app) {
            return new ApoderadoService($app->make(ApoderadoDAO::class));
        });

        // Binding MatriculaDAO → MatriculaService
        $this->app->bind(MatriculaDAO::class, function($app) {
            return new MatriculaDAO();
        });
        $this->app->bind(MatriculaService::class, function($app) {
            return new MatriculaService($app->make(MatriculaDAO::class));
        });

        // Binding DocenteDAO → DocenteService
        $this->app->bind(DocenteDAO::class, function($app) {
            return new DocenteDAO();
        });
        $this->app->bind(DocenteService::class, function($app) {
            return new DocenteService($app->make(DocenteDAO::class));
        });

        // Binding UsuarioDAO → UsuarioService
        $this->app->bind(UsuarioDAO::class, function($app) {
            return new UsuarioDAO();
        });
        $this->app->bind(UsuarioService::class, function($app) {
            return new UsuarioService($app->make(UsuarioDAO::class));
        });

        // Binding AsistenciaAlumnoDAO → AsistenciaAlumnoService
        $this->app->bind(AsistenciaAlumnoDAO::class, function($app) {
            return new AsistenciaAlumnoDAO();
        });
        $this->app->bind(AsistenciaAlumnoService::class, function($app) {
            return new AsistenciaAlumnoService($app->make(AsistenciaAlumnoDAO::class));
        });

        // Binding AsistenciaDocenteDAO → AsistenciaDocenteService
        $this->app->bind(AsistenciaDocenteDAO::class, function($app) {
            return new AsistenciaDocenteDAO();
        });
        $this->app->bind(AsistenciaDocenteService::class, function($app) {
            return new AsistenciaDocenteService($app->make(AsistenciaDocenteDAO::class));
        });

        // Binding NotaDAO → NotaService
        $this->app->bind(NotaDAO::class, function($app) {
            return new NotaDAO();
        });
        $this->app->bind(NotaService::class, function($app) {
            return new NotaService($app->make(NotaDAO::class));
        });

        // Binding PagoDAO → PagoService
        $this->app->bind(PagoDAO::class, function($app) {
            return new PagoDAO();
        });
        $this->app->bind(PagoService::class, function($app) {
            return new PagoService($app->make(PagoDAO::class));
        });
    }

    public function boot()
    {
        //
    }
}
