<?php

namespace App\Contracts;

use App\Models\Alumno;

interface AlumnoRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?Alumno;
    public function create(array $data): Alumno;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
