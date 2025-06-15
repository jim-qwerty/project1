<?php

namespace App\Http\Controllers;

use App\Http\Requests\Matricula\StoreMatriculaRequest;
use App\Http\Requests\Matricula\UpdateMatriculaRequest;
use App\Services\MatriculaService;
use Illuminate\Http\Request;

class MatriculaController extends Controller
{
    protected MatriculaService $service;

    public function __construct(MatriculaService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $matriculas = $this->service->listar();
        return response()->json($matriculas);
    }

    public function create()
    {
        return view('matriculas.create');
    }

    public function store(StoreMatriculaRequest $request)
    {
        $matricula = $this->service->crear($request->validated());
        return response()->json($matricula, 201);
    }

    public function show($id)
    {
        $matricula = $this->service->obtener($id);
        if (! $matricula) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($matricula);
    }

    public function edit($id)
    {
        $matricula = $this->service->obtener($id);
        if (! $matricula) {
            abort(404);
        }
        return view('matriculas.edit', compact('matricula'));
    }

    public function update(UpdateMatriculaRequest $request, $id)
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
