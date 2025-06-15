<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Grado;
use App\Models\Seccion;

class Docente extends Model
{
    protected $fillable = [
      'nombres','apellidos','dni','fecha_nacimiento','edad',
      'grado_asignado_id','seccion_asignada_id',
      'correo_electronico','celular','direccion','sexo','estado',
    ];

    public function gradoAsignado()
    {
        return $this->belongsTo(Grado::class, 'grado_asignado_id');
    }

    public function seccionAsignada()
    {
        return $this->belongsTo(Seccion::class, 'seccion_asignada_id');
    }

    public function asistencias()
    {
        return $this->hasMany(AsistenciaDocente::class, 'docente_id');
    }

    public function notasRegistradas()
    {
        return $this->hasMany(Nota::class, 'docente_id');
    }

    public function usuario()
    {
        return $this->hasOne(Usuario::class, 'docente_id');
    }
}
