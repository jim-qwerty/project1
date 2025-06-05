<?php

namespace App\DAOs;

use App\Models\Matricula;

class MatriculaDAO
{
    public function getAll()
    {
        return Matricula::with('alumno')->get();
    }

    public function findById(int $id): ?Matricula
    {
        return Matricula::find($id);
    }

    public function create(array $data): Matricula
    {
        return Matricula::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $matricula = Matricula::find($id);
        if (! $matricula) {
            return false;
        }
        return $matricula->update($data);
    }

    public function delete(int $id): bool
    {
        $matricula = Matricula::find($id);
        if (! $matricula) {
            return false;
        }
        return $matricula->delete();
    }
}