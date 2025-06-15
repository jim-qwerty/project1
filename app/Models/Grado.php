<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grado extends Model
{
    protected $table = 'grados';

    protected $fillable = [
        'nombre',
        'nivel_educativo',
    ];

    

    /**
     * Un grado puede tener varios docentes asignados
     */
    public function docentesAsignados()
    {
        return $this->hasMany(Docente::class, 'grado_asignado_id');
    }
}
