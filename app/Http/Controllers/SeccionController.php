<?php

namespace App\Http\Controllers;

use App\Http\Requests\Seccion\StoreSeccionRequest;
use App\Http\Requests\Seccion\UpdateSeccionRequest;
use App\Services\SeccionService;

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

    public function create()
    {
        return view('secciones.create');
    }

    public function store(StoreSeccionRequest $request)
    {
        $datos    = $request->validated();
        $seccion  = $this->service->crear($datos);
        return response()->json($seccion, 201);
    }

    public function show($id)
    {
        $seccion = $this->service->obtener($id);
        if (! $seccion) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($seccion);
    }

    public function edit($id)
    {
        $seccion = $this->service->obtener($id);
        if (! $seccion) {
            abort(404);
        }
        return view('secciones.edit', compact('seccion'));
    }

    public function update(UpdateSeccionRequest $request, $id)
    {
        $datos = $request->validated();
        $ok    = $this->service->actualizar($id, $datos);
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
