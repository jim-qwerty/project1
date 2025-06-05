<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});


Route::get('/login', function () {
    return view('login.login');
});


Route::get('/forms/{carpeta}/{formulario}', function ($carpeta, $formulario) {
    return view("forms.$carpeta.$formulario");
});





use App\Http\Controllers\GradoController;
use App\Http\Controllers\SeccionController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\ApoderadoController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AsistenciaAlumnoController;
use App\Http\Controllers\AsistenciaDocenteController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\PagoController;

// Se define cada ruta como recurso RESTful (GET, POST, PUT/PATCH, DELETE)
Route::resource('grados', GradoController::class);
Route::resource('secciones', SeccionController::class);
Route::resource('cursos', CursoController::class);
Route::resource('alumnos', AlumnoController::class);
Route::resource('apoderados', ApoderadoController::class);
Route::resource('matriculas', MatriculaController::class);
Route::resource('docentes', DocenteController::class);
Route::resource('usuarios', UsuarioController::class);
Route::resource('asistencia-alumnos', AsistenciaAlumnoController::class);
Route::resource('asistencia-docentes', AsistenciaDocenteController::class);
Route::resource('notas', NotaController::class);
Route::resource('pagos', PagoController::class);

