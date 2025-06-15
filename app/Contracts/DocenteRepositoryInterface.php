<?php

namespace App\Contracts;

use App\Models\Docente;

interface DocenteRepositoryInterface
{
    public function getAll();
    public function findById(int $id): ?Docente;
    public function create(array $data): Docente;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
