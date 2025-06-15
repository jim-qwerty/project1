<?php

namespace App\Contracts;

use App\Models\Usuario;
use Illuminate\Support\Collection;

interface UsuarioRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): ?Usuario;
    public function findByUsername(string $username): ?Usuario;
    public function create(array $data): Usuario;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
