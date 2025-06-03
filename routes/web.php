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




/*
Route::get('/formulario-historial-asistencia', fn() => view('forms.asistencia.historialAsistencia'));
Route::get('/formulario-registro-alumnos', fn() => view('forms.asistencia.registroAlumnos'));
Route::get('/formulario-registro-docente', fn() => view('forms.asistencia.registroDocente'));

Route::get('/formulario-crear-usuarios', fn() => view('forms.gestionUsuarios.crearUsuarios'));
Route::get('/formulario-lista-usuarios', fn() => view('forms.gestionUsuarios.listaUsuarios'));


Route::get('/formulario-lista-matriculas', fn() => view('forms.matricula.listaMatriculas'));



Route::get('/formulario-lista-notas', fn() => view('forms.notas.listaNotas'));
Route::get('/formulario-registro-notas', fn() => view('forms.notas.registroNotas'));


Route::get('/formulario-historial-pagos', fn() => view('forms.pagos.historialPagos'));
Route::get('/formulario-pago-mensual', fn() => view('forms.pagos.pagoMensual'));


Route::get('/formulario-agregar-profesores', fn() => view('forms.profesores.agregarProfesores'));
Route::get('/formulario-lista-profesores', fn() => view('forms.profesores.listaProfesores'));
*/