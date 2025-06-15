<?php

namespace App\Http\Requests\AsistenciaDocente;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAsistenciaDocenteRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'docente_id'    => 'sometimes|required|exists:docentes,id',
            'fecha'         => 'sometimes|required|date',
            'hora_registro' => 'sometimes|required|date_format:H:i:s',
        ];
    }
}
