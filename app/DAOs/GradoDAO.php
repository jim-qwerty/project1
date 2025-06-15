<?php

namespace App\DAOs;

use App\Contracts\GradoRepositoryInterface;
use App\Models\Grado;

class GradoDAO implements GradoRepositoryInterface
{
    public function getAll()
    {
        // Incluimos relaciones si las hubiera
        return Grado::with(['secciones', 'docentesAsignados'])->get();
    }

    public function findById(int $id): ?Grado
    {
        return Grado::with(['secciones', 'docentesAsignados'])->find($id);
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
