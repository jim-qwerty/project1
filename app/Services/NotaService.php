<?php

namespace App\Services;

use App\Contracts\NotaRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Models\Nota;

class NotaService
{
    public function __construct(protected NotaRepositoryInterface $repo) {}

    public function listar(): Collection
    {
        return $this->repo->getAll();
    }

    public function obtener(int $id): ?Nota
    {
        return $this->repo->findById($id);
    }

    public function crear(array $datos): Nota
    {
        return DB::transaction(fn() => 
            $this->repo->createOrUpdate($datos)
        );
    }

    public function actualizar(int $id, array $datos): bool
    {
        return $this->repo->update($id, $datos);
    }

    public function eliminar(int $id): bool
    {
        return $this->repo->delete($id);
    }

    public function listarPorFiltros(array $filters): Collection
    {
        return $this->repo->getByFilters($filters);
    }
}
