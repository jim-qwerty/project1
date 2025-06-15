<?php

namespace App\Http\Controllers;

use App\Http\Requests\Curso\StoreCursoRequest;
use App\Http\Requests\Curso\UpdateCursoRequest;
use App\Services\CursoService;

class CursoController extends Controller
{
    protected CursoService $service;

    public function __construct(CursoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function create()
    {
        return view('cursos.create');
    }

    public function store(StoreCursoRequest $request)
    {
        $curso = $this->service->crear($request->validated());
        return response()->json($curso, 201);
    }

    public function show($id)
    {
        $curso = $this->service->obtener($id);
        if (! $curso) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($curso);
    }

    public function edit($id)
    {
        $curso = $this->service->obtener($id);
        if (! $curso) {
            abort(404);
        }
        return view('cursos.edit', compact('curso'));
    }

    public function update(UpdateCursoRequest $request, $id)
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
