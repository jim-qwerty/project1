<?php

namespace App\Services;

use App\Contracts\UsuarioRepositoryInterface;
use App\Models\Usuario;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioService
{
    protected UsuarioRepositoryInterface $repo;

    public function __construct(UsuarioRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Devuelve todos los usuarios.
     */
    public function listar(): Collection
    {
        return $this->repo->getAll();
    }

    /**
     * Obtiene un usuario por su ID.
     */
    public function obtener(int $id): ?Usuario
    {
        return $this->repo->findById($id);
    }

    /**
     * Crea un nuevo usuario.
     * Espera recibir 'password' en el array de datos.
     * Se encarga de hashear y asignar 'password_hash'.
     */
    public function crear(array $datos): Usuario
    {
        return DB::transaction(function () use ($datos) {
            // Hasheamos la contraseña
            $datos['password_hash'] = Hash::make($datos['password']);
            // Eliminamos el campo 'password' para que no exista conflicto
            unset($datos['password']);

            return $this->repo->create($datos);
        });
    }

    /**
     * Actualiza un usuario existente.
     * Si se envía 'password', lo hashea y actualiza 'password_hash'.
     */
    public function actualizar(int $id, array $datos): bool
    {
        // Si viene nueva contraseña, la procesamos
        if (isset($datos['password'])) {
            $datos['password_hash'] = Hash::make($datos['password']);
            unset($datos['password']);
        }

        return $this->repo->update($id, $datos);
    }

    /**
     * Elimina un usuario por su ID.
     */
    public function eliminar(int $id): bool
    {
        return $this->repo->delete($id);
    }
}
