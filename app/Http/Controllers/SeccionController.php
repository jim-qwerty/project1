<?php

namespace App\Http\Controllers;

use App\Services\SeccionService;
use Illuminate\Http\Request;

class SeccionController extends Controller
{
    protected $service;

    public function __construct(SeccionService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $secciones = $this->service->listar();
        return response()->json($secciones);
    }

    public function show($id)
    {
        $seccion = $this->service->obtener($id);
        if (! $seccion) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($seccion);
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'grado_id' => 'required|exists:grados,id',
            'nombre'   => 'required|string|max:10',
        ]);

        $seccion = $this->service->crear($datos);
        return response()->json($seccion, 201);
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'grado_id' => 'sometimes|required|exists:grados,id',
            'nombre'   => 'sometimes|required|string|max:10',
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
