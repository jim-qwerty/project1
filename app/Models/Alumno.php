<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    protected $fillable = [
        'nombres', 'apellidos', 'dni', 'fecha_nacimiento',
        'sexo', 'direccion', 'grado_id', 'seccion_id',
        'nivel_educativo', 'edad', 'estado_matricula'
    ];

    // Pertenece a un grado
    public function grado()
    {
        return $this->belongsTo(Grado::class, 'grado_id');
    }

    // Pertenece a una sección
    public function seccion()
    {
        return $this->belongsTo(Seccion::class, 'seccion_id');
    }

    // Un alumno puede tener 1 apoderado (o varios)
    public function apoderados()
    {
        return $this->hasMany(Apoderado::class, 'alumno_id');
    }

    // Relación con matrículas
    public function matriculas()
    {
        return $this->hasMany(Matricula::class, 'alumno_id');
    }

    // Relación con pagos
    public function pagos()
    {
        return $this->hasMany(Pago::class, 'alumno_id');
    }

    // Notas
    public function notas()
    {
        return $this->hasMany(Nota::class, 'alumno_id');
    }

    // Asistencia
    public function asistencias()
    {
        return $this->hasMany(AsistenciaAlumno::class, 'alumno_id');
    }
}
