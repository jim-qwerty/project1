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
Route::apiResource('grados', GradoController::class);
Route::apiResource('secciones', SeccionController::class);
Route::apiResource('cursos', CursoController::class);
Route::apiResource('alumnos', AlumnoController::class);
Route::apiResource('apoderados', ApoderadoController::class);
Route::apiResource('matriculas', MatriculaController::class);
Route::apiResource('docentes', DocenteController::class);
Route::apiResource('usuarios', UsuarioController::class);
Route::apiResource('asistencia-alumnos', AsistenciaAlumnoController::class);
Route::apiResource('asistencia-docentes', AsistenciaDocenteController::class);
Route::apiResource('notas', NotaController::class);
Route::apiResource('pagos', PagoController::class);

