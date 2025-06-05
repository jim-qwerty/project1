<?php

namespace App\Services;

use App\DAOs\NotaDAO;
use Illuminate\Support\Facades\DB;

class NotaService
{
    protected $notaDAO;

    public function __construct(NotaDAO $notaDAO)
    {
        $this->notaDAO = $notaDAO;
    }

    public function listar()
    {
        return $this->notaDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->notaDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->notaDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->notaDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->notaDAO->delete($id);
    }
}