<?php

namespace App\Http\Requests\Alumno;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEstadosAlumnoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'updates'            => 'required|array',
            'updates.*.id'       => 'required|integer|exists:alumnos,id',
            'updates.*.estado'   => 'required|string|in:Matriculado,En proceso,Retirado',
        ];
    }
}