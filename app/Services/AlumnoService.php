<?php

namespace App\Services;

use App\DAOs\AlumnoDAO;
use Illuminate\Support\Facades\DB;

class AlumnoService
{
    protected $alumnoDAO;

    public function __construct(AlumnoDAO $alumnoDAO)
    {
        $this->alumnoDAO = $alumnoDAO;
    }

    public function listar()
    {
        return $this->alumnoDAO->getAll();
    }

    public function obtener(int $id)
    {
        return $this->alumnoDAO->findById($id);
    }

    public function crear(array $datos)
    {
        return DB::transaction(function () use ($datos) {
            return $this->alumnoDAO->create($datos);
        });
    }

    public function actualizar(int $id, array $datos)
    {
        return $this->alumnoDAO->update($id, $datos);
    }

    public function eliminar(int $id)
    {
        return $this->alumnoDAO->delete($id);
    }
}
