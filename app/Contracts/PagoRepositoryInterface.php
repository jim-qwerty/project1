<?php

namespace App\Contracts;

use App\Models\Pago;
use Illuminate\Support\Collection;

interface PagoRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): ?Pago;
    public function create(array $data): Pago;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}