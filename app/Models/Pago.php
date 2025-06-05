<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
   protected $fillable = [
        'alumno_id', 'tipo_pago', 'grado_id', 'seccion_id', 
        'mes', 'año', 'fecha_pago', 'monto', 'metodo_pago', 'observacion'
    ];

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
