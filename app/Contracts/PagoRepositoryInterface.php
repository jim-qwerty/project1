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

    /**
     * Retorna pagos filtrados por grado, sección y mes.
     * @param  array{grado_id:int,seccion_id:int,mes:int}  $filtros
     * @return Collection
     */
    public function filtrar(array $filtros): Collection;
}