<?php

namespace App\Http\Controllers;

use App\Http\Requests\Seccion\StoreSeccionRequest;
use App\Http\Requests\Seccion\UpdateSeccionRequest;
use App\Services\SeccionService;
use Illuminate\Http\JsonResponse;

class SeccionController extends Controller
{
    protected SeccionService $service;

    public function __construct(SeccionService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/secciones
     * Devuelve JSON con los campos mínimos para el frontend: id y nombre.
     */
    public function index(): JsonResponse
    {
        $secciones = $this->service->listar()
            ->map(fn($s) => [
                'id'     => $s->id,
                'nombre' => $s->nombre,
            ]);

        return response()->json($secciones);
    }

    /**
     * GET /secciones/create
     * Muestra la vista para crear una sección.
     */
    public function create()
    {
        return view('secciones.create');
    }

    /**
     * POST /secciones
     * Crea una nueva sección.
     */
    public function store(StoreSeccionRequest $request): JsonResponse
    {
        $datos   = $request->validated();
        $seccion = $this->service->crear($datos);

        return response()->json($seccion, 201);
    }

    /**
     * GET /secciones/{id}
     * Devuelve los datos de una sección específica.
     */
    public function show(int $id): JsonResponse
    {
        $seccion = $this->service->obtener($id);

        if (! $seccion) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        return response()->json($seccion);
    }

    /**
     * GET /secciones/{id}/edit
     * Muestra la vista para editar una sección.
     */
    public function edit(int $id)
    {
        $seccion = $this->service->obtener($id);

        if (! $seccion) {
            abort(404);
        }

        return view('secciones.edit', compact('seccion'));
    }

    /**
     * PUT|PATCH /secciones/{id}
     * Actualiza los datos de una sección.
     */
    public function update(UpdateSeccionRequest $request, int $id): JsonResponse
    {
        $datos = $request->validated();
        $ok    = $this->service->actualizar($id, $datos);

        if (! $ok) {
            return response()->json(['error' => 'No encontrado o no actualizado'], 404);
        }

        return response()->json(['success' => true]);
    }

    /**
     * DELETE /secciones/{id}
     * Elimina una sección.
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
