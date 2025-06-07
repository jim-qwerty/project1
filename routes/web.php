<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;

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


// Al final la ruta catch-all de formularios
Route::get('/forms/{carpeta}/{formulario}', function ($carpeta, $formulario) {
    return view("forms.$carpeta.$formulario");
});
