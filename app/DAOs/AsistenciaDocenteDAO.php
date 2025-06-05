<?php

namespace App\DAOs;

use App\Models\AsistenciaDocente;

class AsistenciaDocenteDAO
{
    public function getAll()
    {
        return AsistenciaDocente::with('docente')->get();
    }

    public function findById(int $id): ?AsistenciaDocente
    {
        return AsistenciaDocente::find($id);
    }

    public function create(array $data): AsistenciaDocente
    {
        return AsistenciaDocente::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $asistencia = AsistenciaDocente::find($id);
        if (! $asistencia) {
            return false;
        }
        return $asistencia->update($data);
    }

    public function delete(int $id): bool
    {
        $asistencia = AsistenciaDocente::find($id);
        if (! $asistencia) {
            return false;
        }
        return $asistencia->delete();
    }
}