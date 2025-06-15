<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    protected $table = 'secciones';

    protected $fillable = [
        'nombre',
    ];

    /**
     * Una sección puede tener muchos alumnos
     */
    public function alumnos()
    {
        return $this->hasMany(Alumno::class, 'seccion_id');
    }
}
