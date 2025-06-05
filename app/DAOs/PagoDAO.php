<?php


namespace App\DAOs;

use App\Models\Pago;

class PagoDAO
{
    public function getAll()
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
        $pago = Pago::find($id);
        if (! $pago) {
            return false;
        }
        return $pago->update($data);
    }

    public function delete(int $id): bool
    {
        $pago = Pago::find($id);
        if (! $pago) {
            return false;
        }
        return $pago->delete();
    }
}