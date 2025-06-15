<?php

namespace App\DAOs;

use App\Contracts\SeccionRepositoryInterface;
use App\Models\Seccion;

class SeccionDAO implements SeccionRepositoryInterface
{
    public function getAll()
    {
        return Seccion::all();
    }

    public function findById(int $id): ?Seccion
    {
        return Seccion::find($id);
    }

    public function create(array $data): Seccion
    {
        return Seccion::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $seccion = Seccion::find($id);
        if (! $seccion) {
            return false;
        }
        return $seccion->update($data);
    }

    public function delete(int $id): bool
    {
        $seccion = Seccion::find($id);
        if (! $seccion) {
            return false;
        }
        return $seccion->delete();
    }
}
