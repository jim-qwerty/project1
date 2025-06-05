<?php

namespace App\DAOs;

use App\Models\Grado;

class GradoDAO
{
    public function getAll()
    {
        return Grado::all();
    }

    public function findById(int $id): ?Grado
    {
        return Grado::find($id);
    }

    public function create(array $data): Grado
    {
        return Grado::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $grado = Grado::find($id);
        if (! $grado) {
            return false;
        }
        return $grado->update($data);
    }

    public function delete(int $id): bool
    {
        $grado = Grado::find($id);
        if (! $grado) {
            return false;
        }
        return $grado->delete();
    }
}
