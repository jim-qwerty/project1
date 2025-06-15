<?php

namespace App\Contracts;

use App\Models\Grado;

interface GradoRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?Grado;
    public function create(array $data): Grado;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
