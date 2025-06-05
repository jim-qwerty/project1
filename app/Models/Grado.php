<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grado extends Model
{
    protected $fillable = ['nombre', 'nivel_educativo'];

    // Un grado puede tener muchas secciones
    public function secciones()
    {
        return $this->hasMany(Seccion::class, 'grado_id');
    }

    // Un grado puede tener muchos alumnos
    public function alumnos()
    {
        return $this->hasMany(Alumno::class, 'grado_id');
    }

    // Un grado puede tener muchos docentes asignados
    public function docentesAsignados()
    {
        return $this->hasMany(Docente::class, 'grado_asignado_id');
    }
}
