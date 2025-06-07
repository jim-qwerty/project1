<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    // Campos asignables
    protected $fillable = [
      'username','password_hash',
      'rol','docente_id',
      'nombres','apellidos'
      // NOTA: ya no incluimos 'estado' en fillable si no lo enviamos desde el form
    ];

    // Atributos que siempre parten con este valor
    protected $attributes = [
      'estado' => 'activo',
    ];

    protected $hidden = ['password_hash'];

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }
}
