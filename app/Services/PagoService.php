<?php

namespace App\Services;

use App\Contracts\PagoRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Models\Pago;

class PagoService
{
    public function __construct(protected PagoRepositoryInterface $repo) {}

    public function listar(): Collection
    {
        return $this->repo->getAll();
    }

    public function obtener(int $id): ?Pago
    {
        return $this->repo->findById($id);
    }

    public function crear(array $datos): Pago
    {
        return DB::transaction(fn() => $this->repo->create($datos));
    }

    public function actualizar(int $id, array $datos): bool
    {
        return $this->repo->update($id, $datos);
    }

    public function eliminar(int $id): bool
    {
        return $this->repo->delete($id);
    }
}
