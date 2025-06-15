<?php

namespace App\Services;

use App\Contracts\SeccionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class SeccionService
{
    protected $repository;

    public function __construct(SeccionRepositoryInterface $repository)
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
        return DB::transaction(function () use ($datos) {
            return $this->repository->create($datos);
        });
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
