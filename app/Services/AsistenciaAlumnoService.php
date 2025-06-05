<?php

namespace App\Services;

use App\DAOs\AsistenciaAlumnoDAO;
use Illuminate\Support\Facades\DB;

class AsistenciaAlumnoService
{
    protected $asistenciaDAO;

    public function __construct(AsistenciaAlumnoDAO $asistenciaDAO)
    {
        $this->asistenciaDAO = $asistenciaDAO;
    }

    public function listar()
    {
        return $this->asistenciaDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->asistenciaDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->asistenciaDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->asistenciaDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->asistenciaDAO->delete($id);
    }
}
