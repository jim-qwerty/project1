<?php

namespace App\Contracts;

use App\Models\AsistenciaAlumno;

interface AsistenciaAlumnoRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?AsistenciaAlumno;
    public function create(array $data): AsistenciaAlumno;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
