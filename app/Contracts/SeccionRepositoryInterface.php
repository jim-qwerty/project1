<?php

namespace App\Contracts;

use App\Models\Seccion;

interface SeccionRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?Seccion;
    public function create(array $data): Seccion;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
