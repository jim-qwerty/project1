<?php

namespace App\Http\Requests\Grado;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nombre'          => 'required|string|max:50',
            'nivel_educativo' => 'required|string|max:50',
        ];
    }
}
