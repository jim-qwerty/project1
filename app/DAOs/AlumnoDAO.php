<?php

namespace App\DAOs;

use App\Contracts\AlumnoRepositoryInterface;
use App\Models\Alumno;

class AlumnoDAO implements AlumnoRepositoryInterface
{
    public function getAll()
    {
        return Alumno::with(['grado', 'seccion'])->get();
    }

    public function findById(int $id): ?Alumno
    {
        return Alumno::with(['grado', 'seccion', 'apoderados'])->find($id);
    }

    public function create(array $data): Alumno
    {
        return Alumno::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $alumno = Alumno::find($id);
        if (! $alumno) {
            return false;
        }
        return $alumno->update($data);
    }

    public function delete(int $id): bool
    {
        $alumno = Alumno::find($id);
        if (! $alumno) {
            return false;
        }
        return $alumno->delete();
    }
}
