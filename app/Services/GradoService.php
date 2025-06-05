<?php

namespace App\Services;

use App\DAOs\GradoDAO;
use Illuminate\Support\Facades\DB;

class GradoService
{
    protected $gradoDAO;

    public function __construct(GradoDAO $gradoDAO)
    {
        $this->gradoDAO = $gradoDAO;
    }

    public function listar()
    {
        return $this->gradoDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->gradoDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->gradoDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->gradoDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->gradoDAO->delete($id);
    }
}