<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Docente;

class AsistenciaDocente extends Model
{
    use HasFactory;

    protected $table = 'asistencia_docentes';

    protected $fillable = [
        'docente_id',
        'fecha',
        'hora_registro',
    ];

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }
}
