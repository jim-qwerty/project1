<?php

namespace App\Http\Controllers;

use App\Http\Requests\Grado\StoreGradoRequest;
use App\Http\Requests\Grado\UpdateGradoRequest;
use App\Services\GradoService;

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

    public function create()
    {
        return view('grados.create');
    }

    public function store(StoreGradoRequest $request)
    {
        $datos = $request->validated();
        $grado = $this->service->crear($datos);
        return response()->json($grado, 201);
    }

    public function show($id)
    {
        $grado = $this->service->obtener($id);
        if (! $grado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($grado);
    }

    public function edit($id)
    {
        $grado = $this->service->obtener($id);
        if (! $grado) {
            abort(404);
        }
        return view('grados.edit', compact('grado'));
    }

    public function update(UpdateGradoRequest $request, $id)
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
