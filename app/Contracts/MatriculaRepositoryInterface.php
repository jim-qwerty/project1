<?php

namespace App\Contracts;

use App\Models\Matricula;

interface MatriculaRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?Matricula;
    public function create(array $data): Matricula;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
