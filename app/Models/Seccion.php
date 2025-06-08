<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    // ← Aquí indicas el nombre real de la tabla
    protected $table = 'secciones';

    // Lista sólo las columnas que realmente existen
    protected $fillable = ['nombre'];

    // Quita o adapta esta relación si ya no existe grado_id en la tabla
    // public function grado()
    // {
    //     return $this->belongsTo(Grado::class, 'grado_id');
    // }

    public function alumnos()
    {
        return $this->hasMany(Alumno::class, 'seccion_id');
    }

    public function docentesAsignados()
    {
        return $this->hasMany(Docente::class, 'seccion_asignada_id');
    }
}
