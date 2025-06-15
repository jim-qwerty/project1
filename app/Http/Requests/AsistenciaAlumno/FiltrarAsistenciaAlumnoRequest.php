<?php

namespace App\Http\Requests\AsistenciaAlumno;

use Illuminate\Foundation\Http\FormRequest;

class FiltrarAsistenciaAlumnoRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'grado_id'   => 'required|exists:grados,id',
            'seccion_id' => 'required|exists:secciones,id',
            'mes'        => 'required|date_format:Y-m',
        ];
    }
}
