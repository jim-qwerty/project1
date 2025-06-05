<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $fillable = ['username', 'password_hash', 'rol', 'docente_id', 'estado'];

    // Indica que la contraseña se guarda en password_hash
    protected $hidden = ['password_hash'];

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }
}
