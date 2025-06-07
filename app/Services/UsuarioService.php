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
            // Hashear contraseña
            $datos['password_hash'] = Hash::make($datos['password_hash']);
            // Estado por defecto
            $datos['estado'] = $datos['estado'] ?? 'activo';
            return $this->usuarioDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->usuarioDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->usuarioDAO->delete($id);
    }
}
