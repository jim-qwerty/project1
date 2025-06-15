<?php

namespace App\Http\Requests\Pago;

use Illuminate\Foundation\Http\FormRequest;

class StorePagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'alumno_id'    => 'required|integer|exists:alumnos,id',
            'grado_id'     => 'required|integer|exists:grados,id',
            'seccion_id'   => 'required|integer|exists:secciones,id',
            'mes'          => 'nullable|integer|min:1|max:12',
            'año'          => 'required|integer|min:2000',
            'fecha_pago'   => 'required|date',
            'monto'        => 'required|numeric|min:0',
            'metodo_pago'  => 'nullable|string|max:50',
            'observacion'  => 'nullable|string',
        ];
    }
}
