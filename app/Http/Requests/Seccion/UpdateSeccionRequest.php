<?php

namespace App\Http\Requests\Seccion;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeccionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // Si tu ruta resource usa {seccion}:
        $id = $this->route('seccion');

        return [
            'nombre' => "sometimes|required|string|max:10",
        ];
    }
}
