<?php

namespace App\Services;

use App\DAOs\ApoderadoDAO;
use Illuminate\Support\Facades\DB;

class ApoderadoService
{
    protected $apoderadoDAO;

    public function __construct(ApoderadoDAO $apoderadoDAO)
    {
        $this->apoderadoDAO = $apoderadoDAO;
    }

    public function listar()
    {
        return $this->apoderadoDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->apoderadoDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->apoderadoDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->apoderadoDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->apoderadoDAO->delete($id);
    }
}