<?php

namespace App\Contracts;

use App\Models\Apoderado;

interface ApoderadoRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?Apoderado;
    public function create(array $data): Apoderado;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
