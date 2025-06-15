<?php

namespace App\Contracts;

use App\Models\Curso;

interface CursoRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?Curso;
    public function create(array $data): Curso;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
