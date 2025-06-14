<?php

namespace App\Http\Requests\Alumno;

use Illuminate\Foundation\Http\FormRequest;

class StoreAlumnoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nombres'          => 'required|string|max:100',
            'apellidos'        => 'required|string|max:100',
            'dni'              => 'required|size:8|unique:alumnos,dni',
            'fecha_nacimiento' => 'required|date',
            'sexo'             => 'required|in:M,F',
            'direccion'        => 'nullable|string|max:200',
            'grado_id'         => 'required|exists:grados,id',
            'seccion_id'       => 'required|exists:secciones,id',
            'nivel_educativo'  => 'required|string|max:50',
            'edad'             => 'nullable|integer',
            'estado_matricula' => 'in:matriculado,en_proceso,retirado',
        ];
    }
}

