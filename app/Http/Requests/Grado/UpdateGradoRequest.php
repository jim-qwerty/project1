<?php

namespace App\Http\Requests\Grado;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // si tu ruta usa {grado}:
        $id = $this->route('grado');

        return [
            'nombre'          => "sometimes|required|string|max:50",
            'nivel_educativo' => "sometimes|required|string|max:50",
        ];
    }
}
