<?php

namespace App\Http\Controllers;

use App\Services\CursoService;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    protected $service;

    public function __construct(CursoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $cursos = $this->service->listar();
        return response()->json($cursos);
    }

    public function show($id)
    {
        $curso = $this->service->obtener($id);
        if (! $curso) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($curso);
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $curso = $this->service->crear($datos);
        return response()->json($curso, 201);
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|required|string|max:100',
        ]);

        $ok = $this->service->actualizar($id, $datos);
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
