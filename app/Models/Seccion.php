<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    protected $fillable = ['grado_id', 'nombre'];

    // Pertenece a un grado
    public function grado()
    {
        return $this->belongsTo(Grado::class, 'grado_id');
    }

    // Una sección tiene muchos alumnos
    public function alumnos()
    {
        return $this->hasMany(Alumno::class, 'seccion_id');
    }

    // Docentes asignados a esta sección
    public function docentesAsignados()
    {
        return $this->hasMany(Docente::class, 'seccion_asignada_id');
    }
}
