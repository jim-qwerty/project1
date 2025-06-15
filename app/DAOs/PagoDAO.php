<?php

namespace App\DAOs;

use App\Contracts\PagoRepositoryInterface;
use App\Models\Pago;
use Illuminate\Support\Collection;

class PagoDAO implements PagoRepositoryInterface
{
    public function getAll(): Collection
    {
        return Pago::with(['alumno', 'grado', 'seccion'])->get();
    }

    public function findById(int $id): ?Pago
    {
        return Pago::find($id);
    }

    public function create(array $data): Pago
    {
        return Pago::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $pago = $this->findById($id);
        return $pago ? $pago->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $pago = $this->findById($id);
        return $pago ? $pago->delete() : false;
    }
}
