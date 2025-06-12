<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $fillable = [
    'alumno_id','grado_id','seccion_id',
    'curso_id','bimestre',
    'competencia1','competencia2','competencia3','nota_final'
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

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'docente_id');
    }

}
