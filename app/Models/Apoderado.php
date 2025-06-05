<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apoderado extends Model
{
    protected $fillable = ['alumno_id', 'nombres', 'apellidos', 'dni', 'parentesco', 'celular', 'correo_electronico'];

    // Pertenece a un alumno
    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'alumno_id');
    }
}
