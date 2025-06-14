<?php

namespace App\Http\Requests\Apoderado;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApoderadoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // obtenemos el parámetro de ruta {id}
        $id = $this->route('id');

        return [
            'alumno_id'         => 'sometimes|required|exists:alumnos,id',
            'nombres'          => 'sometimes|required|string|max:100',
            'apellidos'        => 'sometimes|required|string|max:100',
            'dni'              => "sometimes|required|size:8|unique:apoderados,dni,{$id}",
            'parentesco'       => 'sometimes|required|string|max:50',
            'celular'          => 'nullable|string|max:20',
            'correo_electronico'=> 'nullable|email|max:100',
        ];
    }
}
