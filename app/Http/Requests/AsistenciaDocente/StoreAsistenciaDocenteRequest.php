<?php

namespace App\Http\Requests\AsistenciaDocente;

use Illuminate\Foundation\Http\FormRequest;

class StoreAsistenciaDocenteRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'docente_id'    => 'required|exists:docentes,id',
            'fecha'         => 'required|date',
            'hora_registro' => 'required|date_format:H:i:s',
        ];
    }
}
