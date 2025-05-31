<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return "ACA SE MOSTRARA ALGO";
});


Route::get('/login', function () {
    return view('login.login');
});
