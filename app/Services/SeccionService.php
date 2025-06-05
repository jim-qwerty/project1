<?php

namespace App\Services;

use App\DAOs\SeccionDAO;
use Illuminate\Support\Facades\DB;

class SeccionService
{
    protected $seccionDAO;

    public function __construct(SeccionDAO $seccionDAO)
    {
        $this->seccionDAO = $seccionDAO;
    }

    public function listar()
    {
        return $this->seccionDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->seccionDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->seccionDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->seccionDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->seccionDAO->delete($id);
    }
}
