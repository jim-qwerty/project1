<?php

namespace App\Http\Requests\Apoderado;

use Illuminate\Foundation\Http\FormRequest;

class StoreApoderadoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'alumno_id'         => 'required|exists:alumnos,id',
            'nombres'          => 'required|string|max:100',
            'apellidos'        => 'required|string|max:100',
            'dni'              => 'required|size:8|unique:apoderados,dni',
            'parentesco'       => 'required|string|max:50',
            'celular'          => 'nullable|string|max:20',
            'correo_electronico'=> 'nullable|email|max:100',
        ];
    }
}
