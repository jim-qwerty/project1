<?php

namespace App\DAOs;

use App\Models\Curso;

class CursoDAO
{
    public function getAll()
    {
        return Curso::all();
    }

    public function findById(int $id): ?Curso
    {
        return Curso::find($id);
    }

    public function create(array $data): Curso
    {
        return Curso::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $curso = Curso::find($id);
        if (! $curso) {
            return false;
        }
        return $curso->update($data);
    }

    public function delete(int $id): bool
    {
        $curso = Curso::find($id);
        if (! $curso) {
            return false;
        }
        return $curso->delete();
    }
}
