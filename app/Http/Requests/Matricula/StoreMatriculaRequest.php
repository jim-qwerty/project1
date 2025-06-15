<?php

namespace App\Http\Requests\Matricula;

use Illuminate\Foundation\Http\FormRequest;

class StoreMatriculaRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'alumno_id'    => 'required|exists:alumnos,id',
            'monto'        => 'required|numeric',
            'metodo_pago'  => 'nullable|string|max:50',
            'fecha_pago'   => 'nullable|date',
            'observacion'  => 'nullable|string',
            'estado_pago'  => 'required|in:pagado,pendiente',
        ];
    }
}
