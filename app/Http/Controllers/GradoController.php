<?php

namespace App\Http\Controllers;

use App\Services\GradoService;
use Illuminate\Http\Request;

class GradoController extends Controller
{
    protected $service;

    public function __construct(GradoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $grados = $this->service->listar();
        return response()->json($grados);
    }

    public function show($id)
    {
        $grado = $this->service->obtener($id);
        if (! $grado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($grado);
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre'          => 'required|string|max:50',
            'nivel_educativo' => 'required|string|max:50',
        ]);

        $grado = $this->service->crear($datos);
        return response()->json($grado, 201);
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'nombre'          => 'sometimes|required|string|max:50',
            'nivel_educativo' => 'sometimes|required|string|max:50',
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
