<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsistenciaDocente extends Model
{
     protected $table = 'asistencia_docentes';

    protected $fillable = [
      'docente_id',
      'fecha',
      'hora_registro',
    ];
}
