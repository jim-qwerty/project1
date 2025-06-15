<?php

// app/Http/Requests/Usuario/UpdateUsuarioRequest.php
namespace App\Http\Requests\Usuario;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('usuario');

        return [
            'username'   => [
                'sometimes','required','string','max:50',
                Rule::unique('usuarios','username')->ignore($id)
            ],
            'password'   => 'sometimes|required|string|min:6',
            'rol'        => 'sometimes|required|in:admin,profesor',
            'docente_id' => 'nullable|integer|exists:docentes,id',
            'estado'     => 'sometimes|required|in:activo,inactivo',
        ];
    }
}


