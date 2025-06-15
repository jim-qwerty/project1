<?php

namespace App\Http\Requests\Docente;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocenteRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'nombres'             => 'required|string|max:100',
            'apellidos'           => 'required|string|max:100',
            'dni'                 => 'required|size:8|unique:docentes,dni',
            'fecha_nacimiento'    => 'required|date',
            'edad'                => 'nullable|integer',
            'grado_asignado_id'   => 'required|exists:grados,id',
            'seccion_asignada_id' => 'required|exists:secciones,id',
            'correo_electronico'  => 'required|email|max:100',
            'celular'             => 'required|size:9',
            'direccion'           => 'required|string|max:200',
            'sexo'                => 'required|in:M,F',
            'estado'              => 'required|in:activo,inactivo',
        ];
    }
}
