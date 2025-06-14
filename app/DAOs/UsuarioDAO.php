<?php

namespace App\DAOs;

use App\Models\Usuario;

class UsuarioDAO
{
    public function getAll()
    {
        return Usuario::with('docente')->get();
    }

    public function findById(int $id): ?Usuario
    {
        return Usuario::find($id);
    }

    public function findByUsername(string $username): ?Usuario
    {
        return Usuario::where('username', $username)->first();
    }

    public function create(array $data): Usuario
    {
        return Usuario::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $usuario = Usuario::find($id);
        if (! $usuario) {
            return false;
        }
        return $usuario->update($data);
    }

    public function delete(int $id): bool
    {
        $usuario = Usuario::find($id);
        if (! $usuario) {
            return false;
        }
        return $usuario->delete();
    }
}
