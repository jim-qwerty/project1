<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{
     protected $table = 'matriculas'; // Si el nombre fuese distinto
    protected $fillable = ['alumno_id', 'monto', 'metodo_pago', 'fecha_pago', 'observacion', 'estado_pago'];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'alumno_id');
    }
}
