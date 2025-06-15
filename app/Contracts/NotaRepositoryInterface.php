<?php

namespace App\Contracts;

use App\Models\Nota;
use Illuminate\Support\Collection;

interface NotaRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): ?Nota;
    public function create(array $data): Nota;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getByFilters(array $filters): Collection;
}
