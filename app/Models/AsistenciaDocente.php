<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsistenciaDocente extends Model
{
    protected $table = 'asistencia_docentes';
    protected $fillable = ['docente_id', 'fecha', 'estado', 'hora_registro'];

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }
}
