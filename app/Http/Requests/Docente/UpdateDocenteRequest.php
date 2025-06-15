<?php

namespace App\Http\Requests\Docente;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocenteRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        $id = $this->route('docente'); // si usas Route::resource('docentes', ...)

        return [
            'nombres'               => 'sometimes|required|string|max:100',
            'apellidos'             => 'sometimes|required|string|max:100',
            'dni'                   => "sometimes|required|size:8|unique:docentes,dni,{$id}",
            'fecha_nacimiento'      => 'sometimes|required|date',
            'edad'                  => 'nullable|integer',
            'grado_asignado_id'     => 'nullable|exists:grados,id',
            'seccion_asignada_id'   => 'nullable|exists:secciones,id',
            'correo_electronico'    => 'nullable|email|max:100',
            'celular'               => 'nullable|size:9',
            'direccion'             => 'nullable|string|max:200',
            'sexo'                  => 'sometimes|required|in:M,F',
            'estado'                => 'sometimes|required|in:activo,inactivo',
        ];
    }
}
