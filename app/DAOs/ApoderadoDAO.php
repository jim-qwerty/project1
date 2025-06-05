<?php

namespace App\DAOs;

use App\Models\Apoderado;

class ApoderadoDAO
{
    public function getAll()
    {
        return Apoderado::with('alumno')->get();
    }

    public function findById(int $id): ?Apoderado
    {
        return Apoderado::find($id);
    }

    public function create(array $data): Apoderado
    {
        return Apoderado::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $apoderado = Apoderado::find($id);
        if (! $apoderado) {
            return false;
        }
        return $apoderado->update($data);
    }

    public function delete(int $id): bool
    {
        $apoderado = Apoderado::find($id);
        if (! $apoderado) {
            return false;
        }
        return $apoderado->delete();
    }
}