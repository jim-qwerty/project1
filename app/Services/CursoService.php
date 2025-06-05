<?php

namespace App\Services;

use App\DAOs\CursoDAO;
use Illuminate\Support\Facades\DB;

class CursoService
{
    protected $cursoDAO;

    public function __construct(CursoDAO $cursoDAO)
    {
        $this->cursoDAO = $cursoDAO;
    }

    public function listar()
    {
        return $this->cursoDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->cursoDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->cursoDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->cursoDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->cursoDAO->delete($id);
    }
}
