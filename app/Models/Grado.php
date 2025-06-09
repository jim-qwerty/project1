<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grado extends Model
{
    protected $table = 'grados';
    protected $fillable = ['nombre', 'nivel_educativo'];

    
    public function docentesAsignados()
    {
        return $this->hasMany(Docente::class, 'grado_asignado_id');
    }
    // …
}
