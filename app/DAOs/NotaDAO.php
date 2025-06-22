<?php

namespace App\DAOs;

use App\Contracts\NotaRepositoryInterface;
use App\Models\Nota;
use Illuminate\Support\Collection;

class NotaDAO implements NotaRepositoryInterface
{
    public function getAll(): Collection
    {
        return Nota::with(['alumno','grado','seccion','curso','docente'])->get();
    }

    public function findById(int $id): ?Nota
    {
        return Nota::find($id);
    }

    public function create(array $data): Nota
    {
        return Nota::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $nota = $this->findById($id);
        return $nota ? $nota->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $nota = $this->findById($id);
        return $nota ? $nota->delete() : false;
    }

    public function getByFilters(array $filters): Collection
    {
        return Nota::where([
                ['grado_id',   $filters['grado_id']],
                ['seccion_id', $filters['seccion_id']],
                ['curso_id',   $filters['curso_id']],
                ['bimestre',   $filters['bimestre']],
            ])
            ->get(['alumno_id','competencia1','competencia2','competencia3','nota_final']);
    }

    public function createOrUpdate(array $data): Nota
{
    $keys = [
      'alumno_id' => $data['alumno_id'],
      'curso_id'  => $data['curso_id'],
      'bimestre'  => $data['bimestre'],
    ];
    return Nota::updateOrCreate($keys, $data);
}
}
