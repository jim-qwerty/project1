<?php
// app/Http/Controllers/GradoController.php

namespace App\Http\Controllers;

use App\Http\Requests\Grado\StoreGradoRequest;
use App\Http\Requests\Grado\UpdateGradoRequest;
use App\Services\GradoService;
use Illuminate\Http\JsonResponse;

class GradoController extends Controller
{
    protected GradoService $service;

    public function __construct(GradoService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/grados
     * Devuelve sólo id y nombre en JSON para el frontend.
     */
    public function index(): JsonResponse
    {
        $grados = collect($this->service->listar())
            ->map(fn($g) => [
                'id'     => $g['id']     ?? $g->id,
                'nombre' => $g['nombre'] ?? $g->nombre,
            ]);

        return response()->json($grados);
    }

    /**
     * GET /grados/create
     */
    public function create()
    {
        return view('grados.create');
    }

    /**
     * POST /grados
     */
    public function store(StoreGradoRequest $request): JsonResponse
    {
        $datos = $request->validated();
        $grado = $this->service->crear($datos);
        return response()->json($grado, 201);
    }

    /**
     * GET /grados/{id}
     */
    public function show(int $id): JsonResponse
    {
        $grado = $this->service->obtener($id);
        if (! $grado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($grado);
    }

    /**
     * GET /grados/{id}/edit
     */
    public function edit(int $id)
    {
        $grado = $this->service->obtener($id);
        if (! $grado) {
            abort(404);
        }
        return view('grados.edit', compact('grado'));
    }

    /**
     * PUT/PATCH /grados/{id}
     */
    public function update(UpdateGradoRequest $request, int $id): JsonResponse
    {
        $datos = $request->validated();
        $ok    = $this->service->actualizar($id, $datos);
        if (! $ok) {
            return response()->json(['error' => 'No encontrado o no actualizado'], 404);
        }
        return response()->json(['success' => true]);
    }

    /**
     * DELETE /grados/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $ok = $this->service->eliminar($id);
        if (! $ok) {
            return response()->json(['error' => 'No encontrado o no eliminado'], 404);
        }
        return response()->json(['success' => true]);
    }
}
