<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsistenciaAlumno extends Model
{
    protected $table = 'asistencia_alumnos';
    protected $fillable = ['alumno_id', 'fecha', 'estado', 'grado_id', 'seccion_id'];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'alumno_id');
    }

    public function grado()
    {
        return $this->belongsTo(Grado::class, 'grado_id');
    }

    public function seccion()
    {
        return $this->belongsTo(Seccion::class, 'seccion_id');
    }
}
