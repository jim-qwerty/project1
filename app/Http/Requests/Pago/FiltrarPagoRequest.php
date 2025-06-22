<?php

namespace App\Http\Requests\Pago;

use Illuminate\Foundation\Http\FormRequest;

class FiltrarPagoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'grado_id'   => ['required', 'integer', 'exists:grados,id'],
            'seccion_id' => ['required', 'integer', 'exists:secciones,id'],
            'mes'        => ['required', 'integer', 'between:1,12'],
            // QUITAMOS 'año'
        ];
    }
}
