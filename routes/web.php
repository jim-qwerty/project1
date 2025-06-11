<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;

use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\ApoderadoController;
use App\Http\Controllers\MatriculaController;

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
