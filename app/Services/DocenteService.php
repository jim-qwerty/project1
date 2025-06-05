<?php

namespace App\Services;

use App\DAOs\DocenteDAO;
use Illuminate\Support\Facades\DB;

class DocenteService
{
    protected $docenteDAO;

    public function __construct(DocenteDAO $docenteDAO)
    {
        $this->docenteDAO = $docenteDAO;
    }

    public function listar()
    {
        return $this->docenteDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->docenteDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->docenteDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->docenteDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->docenteDAO->delete($id);
    }
}