<?php

// app/Http/Requests/Usuario/StoreUsuarioRequest.php
namespace App\Http\Requests\Usuario;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username'   => 'required|string|max:50|unique:usuarios,username',
            'password'   => 'required|string|min:6',  // ya sin confirmed
            'rol'        => 'required|in:admin,profesor',
            'docente_id' => 'nullable|integer|exists:docentes,id',
            'nombres'    => 'required|string|max:100',
            'apellidos'  => 'required|string|max:100',
        ];
    }
}
