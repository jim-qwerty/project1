<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\ApoderadoController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\AsistenciaAlumnoController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\AsistenciaDocenteController;
use App\Http\Controllers\GradoController;
use App\Http\Controllers\SeccionController;
use App\Http\Controllers\Auth\LoginController;

/*
|--------------------------------------------------------------------------
| Rutas Públicas
|--------------------------------------------------------------------------
|
| Aquí va todo lo que debe verse sin haber iniciado sesión:
| - El formulario de login
*/

Route::get('/login', function () {
    return view('login.login');
})->name('login');

// (Opcional) Si tienes controlador de autenticación:
// Route::post('/login', [AuthController::class,'login'])->name('login.post');
// Route::post('/logout', [AuthController::class,'logout'])->name('logout');

Route::get('/login', [LoginController::class, 'showLoginForm'])
     ->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout',[LoginController::class, 'logout'])
     ->name('logout');



/*
|--------------------------------------------------------------------------
| Rutas Protegidas por Autenticación
|--------------------------------------------------------------------------
|
| Todo lo que esté aquí dentro solo está disponible para usuarios
| autenticados. El usuario que no haya iniciado sesión será
| redirigido automáticamente al login.
*/

Route::middleware('auth')->group(function () {
    // Home / Dashboard
    Route::get('/', function () {
        return view('home');
    })->name('home');

    // Matriculación
    Route::post('/alumnos', [AlumnoController::class, 'store'])
         ->name('alumnos.store');
    Route::post('/apoderados', [ApoderadoController::class, 'store'])
         ->name('apoderados.store');
    Route::get('/forms/matricula/pagoMatricula', function () {
        return view('forms.matricula.pagoMatricula');
    });
    Route::post('/matriculas', [MatriculaController::class, 'store'])
         ->name('matriculas.store');

    // Pagos
    Route::get('/pagos/create', [PagoController::class, 'create'])
         ->name('pagos.create');
    Route::post('/pagos', [PagoController::class, 'store'])
         ->name('pagos.store');
    Route::get('/pagos', [PagoController::class, 'index'])
         ->name('pagos.index');

     Route::get('/pagos/filtrar', [PagoController::class, 'filtrar']);
     Route::get('/pagos/deudores', [PagoController::class, 'deudores']);


    // Alumnos (JSON y filtros)
    Route::get('/alumnos/json', [AlumnoController::class, 'indexJson'])
         ->name('alumnos.json');
    Route::match(['get','post'], '/alumnos/filtrar', [AlumnoController::class, 'filtrar'])
         ->name('alumnos.filtrar');

         Route::patch('/alumnos/estado', [AlumnoController::class, 'updateEstados'])
     ->name('alumnos.updateEstados');

    // Notas
    Route::post('/notas', [NotaController::class, 'store'])
         ->name('notas.store');
    Route::get('/notas/filtrar', [NotaController::class, 'indexJson'])
         ->name('notas.filtrar');

    // Asistencia de alumnos
    Route::post('/asistencia-alumnos', [AsistenciaAlumnoController::class, 'store'])
         ->name('asistencia-alumnos.store');
    Route::get('/asistencia-alumnos/filtrar', [AsistenciaAlumnoController::class, 'filtrar'])
         ->name('asistencia-alumnos.filtrar');

    // Docentes
    Route::get('/docentes/create', [DocenteController::class, 'create'])
         ->name('docentes.create');
    Route::post('/docentes', [DocenteController::class, 'store'])
         ->name('docentes.store');
    Route::get('/docentes', [DocenteController::class, 'index'])
         ->name('docentes.index');
    Route::get('/docentes/filtrar', [DocenteController::class, 'filtrar'])
         ->name('docentes.filtrar');

    Route::put('/docentes/{id}', [DocenteController::class, 'update'])
     ->name('docentes.update');

    // Asistencia de docentes
    Route::post('/asistencia-docentes', [AsistenciaDocenteController::class, 'store'])
         ->name('asistencia-docentes.store');

    // Usuarios
    Route::get('/usuarios/create', [UsuarioController::class, 'create'])
         ->name('usuarios.create');
    Route::post('/usuarios', [UsuarioController::class, 'store'])
         ->name('usuarios.store');
    Route::resource('usuarios', UsuarioController::class);


    //Grados y secciones
    // 1) API para consumo por JS
Route::prefix('api')->group(function() {
    Route::get('grados',    [GradoController::class,   'index'])
         ->name('api.grados.index');
    Route::get('secciones', [SeccionController::class, 'index'])
         ->name('api.secciones.index');
});

// 2) Rutas CRUD "web" para administración de Grados y Secciones
//    Excluimos 'index' porque ya lo definimos como API arriba
Route::resource('grados', GradoController::class)
     ->except(['index']);
Route::resource('secciones', SeccionController::class)
     ->except(['index']);

    // Catch-all para vistas de forms dentro de /resources/views/forms/…
    Route::get('/forms/{carpeta}/{formulario}', function ($carpeta, $formulario) {
        return view("forms.$carpeta.$formulario");
    });
});
