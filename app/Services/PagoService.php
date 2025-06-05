<?php

namespace App\Services;

use App\DAOs\PagoDAO;
use Illuminate\Support\Facades\DB;

class PagoService
{
    protected $pagoDAO;

    public function __construct(PagoDAO $pagoDAO)
    {
        $this->pagoDAO = $pagoDAO;
    }

    public function listar()
    {
        return $this->pagoDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->pagoDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->pagoDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->pagoDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->pagoDAO->delete($id);
    }
}
