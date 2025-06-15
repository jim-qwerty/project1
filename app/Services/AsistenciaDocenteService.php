<?php

namespace App\Services;

use App\Contracts\AsistenciaDocenteRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AsistenciaDocenteService
{
    protected AsistenciaDocenteRepositoryInterface $repository;

    public function __construct(AsistenciaDocenteRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function listar()
    {
        return $this->repository->getAll();
    }

    public function obtener(int $id)
    {
        return $this->repository->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(fn() => $this->repository->create($datos));
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->repository->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->repository->delete($id);
    }
}
