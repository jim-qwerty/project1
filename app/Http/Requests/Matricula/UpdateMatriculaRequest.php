<?php

namespace App\Http\Requests\Matricula;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMatriculaRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'alumno_id'    => 'sometimes|required|exists:alumnos,id',
            'monto'        => 'sometimes|required|numeric',
            'metodo_pago'  => 'nullable|string|max:50',
            'fecha_pago'   => 'sometimes|required|date',
            'observacion'  => 'nullable|string',
            'estado_pago'  => 'sometimes|required|in:pagado,pendiente',
        ];
    }
}
