<?php

namespace App\Http\Requests\AsistenciaAlumno;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAsistenciaAlumnoRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'alumno_id'   => 'sometimes|required|exists:alumnos,id',
            'fecha'       => 'sometimes|required|date',
            'estado'      => 'sometimes|required|in:P,T,F',
            'grado_id'    => 'sometimes|required|exists:grados,id',
            'seccion_id'  => 'sometimes|required|exists:secciones,id',
        ];
    }
}
