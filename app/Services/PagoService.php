<?php

namespace App\Services;

use App\Contracts\PagoRepositoryInterface;
use App\Models\Pago;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PagoService
{
    public function __construct(
        protected PagoRepositoryInterface $repo
    ) {}

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

    public function filtrar(array $filtros): Collection
    {
        return $this->repo->filtrar($filtros)
            ->map(fn($pago) => [
                'alumno_id'  => $pago->alumno->id,
                'alumno'     => $pago->alumno->nombres . ' ' . $pago->alumno->apellidos,
                'mes'        => $pago->mes,
                'fecha_pago' => $pago->fecha_pago,
                'monto'      => $pago->monto,
            ]);
    }
}