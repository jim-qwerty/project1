<?php

namespace App\DAOs;

use App\Contracts\UsuarioRepositoryInterface;
use App\Models\Usuario;
use Illuminate\Support\Collection;

class UsuarioDAO implements UsuarioRepositoryInterface
{
    public function getAll(): Collection
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
        $usuario = $this->findById($id);
        return $usuario ? $usuario->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $usuario = $this->findById($id);
        return $usuario ? $usuario->delete() : false;
    }
}
