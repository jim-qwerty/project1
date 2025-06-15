<?php

namespace App\Http\Controllers;

use App\Http\Requests\AsistenciaDocente\StoreAsistenciaDocenteRequest;
use App\Http\Requests\AsistenciaDocente\UpdateAsistenciaDocenteRequest;
use App\Services\AsistenciaDocenteService;
use App\Models\AsistenciaDocente;

class AsistenciaDocenteController extends Controller
{
    protected AsistenciaDocenteService $service;

    public function __construct(AsistenciaDocenteService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function create()
    {
        return view('asistencia-docentes.create');
    }

    public function store(StoreAsistenciaDocenteRequest $request)
    {
        $asistencia = $this->service->crear($request->validated());
        return response()->json($asistencia, 201);
    }

    public function show($id)
    {
        $asistencia = $this->service->obtener($id);
        if (! $asistencia) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($asistencia);
    }

    public function edit($id)
    {
        $asistencia = $this->service->obtener($id);
        if (! $asistencia) {
            abort(404);
        }
        return view('asistencia-docentes.edit', compact('asistencia'));
    }

    public function update(UpdateAsistenciaDocenteRequest $request, $id)
    {
        $ok = $this->service->actualizar($id, $request->validated());
        if (! $ok) {
            return response()->json(['error' => 'No encontrado o no actualizado'], 404);
        }
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $ok = $this->service->eliminar($id);
        if (! $ok) {
            return response()->json(['error' => 'No encontrado o no eliminado'], 404);
        }
        return response()->json(['success' => true]);
    }
}
