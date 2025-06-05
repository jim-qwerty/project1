<?php

namespace App\DAOs;

use App\Models\Docente;

class DocenteDAO
{
    public function getAll()
    {
        return Docente::with(['gradoAsignado', 'seccionAsignada'])->get();
    }

    public function findById(int $id): ?Docente
    {
        return Docente::find($id);
    }

    public function create(array $data): Docente
    {
        return Docente::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $docente = Docente::find($id);
        if (! $docente) {
            return false;
        }
        return $docente->update($data);
    }

    public function delete(int $id): bool
    {
        $docente = Docente::find($id);
        if (! $docente) {
            return false;
        }
        return $docente->delete();
    }
}