<?php

namespace App\Http\Requests\Alumno;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAlumnoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('id');

        return [
            'nombres'          => 'sometimes|required|string|max:100',
            'apellidos'        => 'sometimes|required|string|max:100',
            'dni'              => "sometimes|required|size:8|unique:alumnos,dni,{$id}",
            'fecha_nacimiento' => 'sometimes|required|date',
            'sexo'             => 'sometimes|required|in:M,F',
            'direccion'        => 'nullable|string|max:200',
            'grado_id'         => 'sometimes|required|exists:grados,id',
            'seccion_id'       => 'sometimes|required|exists:secciones,id',
            'nivel_educativo'  => 'sometimes|required|string|max:50',
            'edad'             => 'nullable|integer',
            'estado_matricula' => 'in:matriculado,en_proceso,retirado',
        ];
    }
}

