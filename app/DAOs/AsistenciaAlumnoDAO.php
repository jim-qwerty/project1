<?php

namespace App\DAOs;

use App\Contracts\AsistenciaAlumnoRepositoryInterface;
use App\Models\AsistenciaAlumno;

class AsistenciaAlumnoDAO implements AsistenciaAlumnoRepositoryInterface
{
    public function getAll()
    {
        return AsistenciaAlumno::with(['alumno', 'grado', 'seccion'])->get();
    }

    public function findById(int $id): ?AsistenciaAlumno
    {
        return AsistenciaAlumno::with(['alumno','grado','seccion'])->find($id);
    }

    public function create(array $data): AsistenciaAlumno
    {
        return AsistenciaAlumno::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $asistencia = AsistenciaAlumno::find($id);
        if (! $asistencia) {
            return false;
        }
        return $asistencia->update($data);
    }

    public function delete(int $id): bool
    {
        $asistencia = AsistenciaAlumno::find($id);
        if (! $asistencia) {
            return false;
        }
        return $asistencia->delete();
    }
}
