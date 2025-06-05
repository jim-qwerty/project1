<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $fillable = ['nombre'];

    public function notas()
    {
        return $this->hasMany(Nota::class, 'curso_id');
    }
}
