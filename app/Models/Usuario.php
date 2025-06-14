<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'username',
        'password_hash',
        'rol',
        'docente_id',
        'nombres',
        'apellidos',
    ];

    // Asigna por defecto 'activo' al crear un nuevo registro
    protected $attributes = [
        'estado' => 'activo',
    ];

    // Oculta el hash de la respuesta JSON
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    // Laravel Auth usa esta propiedad como password
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // Relación con Docente
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }
}
