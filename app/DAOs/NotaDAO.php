<?php

namespace App\DAOs;

use App\Models\Nota;

class NotaDAO
{
    public function getAll()
    {
        return Nota::with(['alumno', 'grado', 'seccion', 'curso', 'docente'])->get();
    }

    public function findById(int $id): ?Nota
    {
        return Nota::find($id);
    }

    public function create(array $data): Nota
    {
        return Nota::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $nota = Nota::find($id);
        if (! $nota) {
            return false;
        }
        return $nota->update($data);
    }

    public function delete(int $id): bool
    {
        $nota = Nota::find($id);
        if (! $nota) {
            return false;
        }
        return $nota->delete();
    }
}

