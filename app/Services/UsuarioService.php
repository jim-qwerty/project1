<?php

namespace App\Services;

use App\DAOs\UsuarioDAO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioService
{
    protected $usuarioDAO;

    public function __construct(UsuarioDAO $usuarioDAO)
    {
        $this->usuarioDAO = $usuarioDAO;
    }

    public function listar()
    {
        return $this->usuarioDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->usuarioDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            // Hashear la contraseña antes de crear
            $datos['password_hash'] = Hash::make($datos['password_hash']);
            return $this->usuarioDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        // Si viene nueva contraseña, la hasheamos
        if (isset($datos['password_hash'])) {
            $datos['password_hash'] = Hash::make($datos['password_hash']);
        }
        return $this->usuarioDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->usuarioDAO->delete($id);
    }
}
