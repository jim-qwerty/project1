<?php

namespace App\Contracts;

use App\Models\AsistenciaDocente;

interface AsistenciaDocenteRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?AsistenciaDocente;
    public function create(array $data): AsistenciaDocente;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
