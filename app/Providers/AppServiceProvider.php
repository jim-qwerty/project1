<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Importa las clases DAO e Interface
use App\DAOs\GradoDAO;
use App\Contracts\GradoRepositoryInterface;

use App\DAOs\SeccionDAO;
use App\Contracts\SeccionRepositoryInterface;

use App\DAOs\CursoDAO;
use App\Contracts\CursoRepositoryInterface;

use App\Contracts\AlumnoRepositoryInterface;
use App\DAOs\AlumnoDAO;

use App\Contracts\ApoderadoRepositoryInterface;
use App\DAOs\ApoderadoDAO;

use App\DAOs\MatriculaDAO;
use App\Contracts\MatriculaRepositoryInterface;

use App\DAOs\DocenteDAO;
use App\Contracts\DocenteRepositoryInterface;

use App\DAOs\UsuarioDAO;
use App\Contracts\UsuarioRepositoryInterface;

use App\DAOs\AsistenciaAlumnoDAO;
use App\Contracts\AsistenciaAlumnoRepositoryInterface;

use App\DAOs\AsistenciaDocenteDAO;
use App\Contracts\AsistenciaDocenteRepositoryInterface;

use App\DAOs\NotaDAO;
use App\Contracts\NotaRepositoryInterface;

use App\DAOs\PagoDAO;
use App\Contracts\PagoRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Binding Grado
        $this->app->bind(
            GradoRepositoryInterface::class,
            GradoDAO::class
        );

        // Binding Seccion
        $this->app->bind(
        SeccionRepositoryInterface::class,
        SeccionDAO::class
    );

        // Binding Curso
        $this->app->bind(
            CursoRepositoryInterface::class,
            CursoDAO::class
        );

        
        // Binding Alumno
        $this->app->bind(
            AlumnoRepositoryInterface::class,
            AlumnoDAO::class
        );

        // Binding Apoderado
        $this->app->bind(
        ApoderadoRepositoryInterface::class,
        ApoderadoDAO::class
    );

        // Binding Matricula 
        $this->app->bind(
            MatriculaRepositoryInterface::class,
            MatriculaDAO::class
        );

        // Binding Docente
        $this->app->bind(
            DocenteRepositoryInterface::class,
            DocenteDAO::class
        );

        // Binding Usuario
        $this->app->bind(
            UsuarioRepositoryInterface::class,
            UsuarioDAO::class
    );

        // Binding AsistenciaAlumno
        $this->app->bind(
            AsistenciaAlumnoRepositoryInterface::class,
            AsistenciaAlumnoDAO::class
        );

        // Binding AsistenciaDocente
        $this->app->bind(
            AsistenciaDocenteRepositoryInterface::class,
            AsistenciaDocenteDAO::class
        );

        // Binding Nota
        $this->app->bind(
            NotaRepositoryInterface::class,
            NotaDAO::class
    );

        // Binding Pago
        $this->app->bind(
            PagoRepositoryInterface::class,
            PagoDAO::class
    );
    }

    public function boot()
    {
        //
    }
}
