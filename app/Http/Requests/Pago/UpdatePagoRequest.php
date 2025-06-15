<?php

namespace App\Http\Requests\Pago;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'alumno_id'    => 'sometimes|required|integer|exists:alumnos,id',
            'grado_id'     => 'sometimes|required|integer|exists:grados,id',
            'seccion_id'   => 'sometimes|required|integer|exists:secciones,id',
            'mes'          => 'nullable|integer|min:1|max:12',
            'año'          => 'sometimes|required|integer|min:2000',
            'fecha_pago'   => 'sometimes|required|date',
            'monto'        => 'sometimes|required|numeric|min:0',
            'metodo_pago'  => 'nullable|string|max:50',
            'observacion'  => 'nullable|string',
        ];
    }
}
