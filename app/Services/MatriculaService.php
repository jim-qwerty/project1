<?php

namespace App\Services;

use App\DAOs\MatriculaDAO;
use Illuminate\Support\Facades\DB;

class MatriculaService
{
    protected $matriculaDAO;

    public function __construct(MatriculaDAO $matriculaDAO)
    {
        $this->matriculaDAO = $matriculaDAO;
    }

    public function listar()
    {
        return $this->matriculaDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->matriculaDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->matriculaDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->matriculaDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->matriculaDAO->delete($id);
    }
}

