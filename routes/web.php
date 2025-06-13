<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;

use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\ApoderadoController;
use App\Http\Controllers\MatriculaController;

use App\Http\Controllers\PagoController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\AsistenciaAlumnoController;


//Para matricula
Route::post('/alumnos',      [AlumnoController::class,   'store'])->name('alumnos.store');
Route::post('/apoderados',   [ApoderadoController::class,'store'])->name('apoderados.store');

// para ir a pago de matricula
Route::get('/forms/matricula/pagoMatricula', function () {
    // Laravel buscará resources/views/forms/matricula/pagoMatricula.blade.php
    return view('forms.matricula.pagoMatricula');
});



//Para hacer el pago de matriculas
Route::post('/matriculas', [MatriculaController::class, 'store'])
     ->name('matriculas.store');




//Para lista de matriculas
Route::get('/alumnos/json', [AlumnoController::class, 'indexJson']);


// pagos mensuales
// Para mostrar el formulario
Route::get('/pagos/create', [PagoController::class, 'create'])->name('pagos.create');

// Para guardar el pago
Route::post('/pagos', [PagoController::class, 'store'])->name('pagos.store');

Route::get('/alumnos/filtrar', [AlumnoController::class, 'filtrar'])
     ->name('alumnos.filtrar');
// web.php
Route::post('/alumnos/filtrar', [AlumnoController::class, 'filtrar'])->name('alumnos.filtrar');


// HISTORIAL DE PAGOS
     Route::get('/pagos',        [PagoController::class,   'index'])->name('pagos.index');
Route::get('/alumnos/json', [AlumnoController::class,'indexJson']);

// Para obtener el listado completo de pagos en JSON
Route::get('/pagos', [PagoController::class, 'index'])
     ->name('pagos.index');


//REGISTRO DE NOTAS
Route::post('/alumnos/filtrar', [AlumnoController::class, 'filtrar'])->name('alumnos.filtrar');
// routes/web.php


//Para pasar los datos del formulario de notas a la bd
Route::post('/notas', [NotaController::class, 'store'])->name('notas.store');

//Pasar notas del bd al formulario
Route::get('/notas/filtrar', [NotaController::class,'indexJson']);




//Registro de asistencia de alumnos
Route::post('/asistencia-alumnos', [AsistenciaAlumnoController::class, 'store'])
     ->name('asistencia-alumnos.store');

   //PARA LA LISTA DE ASISTENCIA DE ALUMNOS

Route::get('/asistencia-alumnos/filtrar', [AsistenciaAlumnoController::class, 'filtrar'])
     ->name('asistencia-alumnos.filtrar');




Route::get('/', function () {
    return view('home');
});


Route::get('/login', function () {
    return view('login.login');
});


// Primero todas las rutas "reales"
Route::get('/usuarios/create', [UsuarioController::class, 'create'])->name('usuarios.create');
Route::post('/usuarios',       [UsuarioController::class, 'store'])->name('usuarios.store');
Route::resource('usuarios', UsuarioController::class);


use App\Http\Controllers\DocenteController;

Route::get('/docentes/create', [DocenteController::class, 'create'])
     ->name('docentes.create');

Route::post('/docentes', [DocenteController::class, 'store'])
     ->name('docentes.store');


     // Listar (JSON) todos los docentes
Route::get('/docentes', [DocenteController::class, 'index'])
     ->name('docentes.index');

// Al final la ruta catch-all de formularios
Route::get('/forms/{carpeta}/{formulario}', function ($carpeta, $formulario) {
    return view("forms.$carpeta.$formulario");
});
