<?php
// app/DAOs/GradoDAO.php

namespace App\DAOs;

use App\Contracts\GradoRepositoryInterface;
use App\Models\Grado;

class GradoDAO implements GradoRepositoryInterface
{
    public function getAll()
    {
        // Sin eager-load de secciones (no existe relación)
        return Grado::all();
    }

    public function findById(int $id): ?Grado
    {
        // Sólo cargamos la relación de docentesAsignados
        return Grado::with('docentesAsignados')->find($id);
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
