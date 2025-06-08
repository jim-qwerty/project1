<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Grado;    // ← importa tu modelo Grado
use App\Models\Seccion;  // ← importa tu modelo Seccion

class Docente extends Model
{
    protected $fillable = [
      'nombres','apellidos','dni','fecha_nacimiento','edad',
      'grado_asignado_id','seccion_asignada_id',
      'correo_electronico','celular','direccion','sexo','estado',
    ];

    // Un docente asignado a un grado y sección
    public function gradoAsignado()
    {
        return $this->belongsTo(Grado::class, 'grado_asignado_id');
    }

    public function seccionAsignada()
    {
        return $this->belongsTo(Seccion::class, 'seccion_asignada_id');
    }

    // Asistencia del docente
    public function asistencias()
    {
        return $this->hasMany(AsistenciaDocente::class, 'docente_id');
    }

    // Notas que registra
    public function notasRegistradas()
    {
        return $this->hasMany(Nota::class, 'docente_id');
    }

    // Usuario (si tiene cuenta)
    public function usuario()
    {
        return $this->hasOne(Usuario::class, 'docente_id');
    }
}
