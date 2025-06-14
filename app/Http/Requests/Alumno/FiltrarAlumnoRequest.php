<?php

namespace App\Http\Requests\Alumno;

use Illuminate\Foundation\Http\FormRequest;

class FiltrarAlumnoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'grado_id'   => 'required|exists:grados,id',
            'seccion_id' => 'required|exists:secciones,id',
        ];
    }
}

