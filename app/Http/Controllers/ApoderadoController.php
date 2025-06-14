<?php

namespace App\Http\Controllers;

use App\Http\Requests\Apoderado\StoreApoderadoRequest;
use App\Http\Requests\Apoderado\UpdateApoderadoRequest;
use App\Services\ApoderadoService;

class ApoderadoController extends Controller
{
    protected $service;

    public function __construct(ApoderadoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $apoderados = $this->service->listar();
        return response()->json($apoderados);
    }

    public function create()
    {
        return view('apoderados.create');
    }

    public function store(StoreApoderadoRequest $request)
    {
        $datos     = $request->validated();
        $apoderado = $this->service->crear($datos);
        return response()->json($apoderado, 201);
    }

    public function show($id)
    {
        $apoderado = $this->service->obtener($id);
        if (! $apoderado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($apoderado);
    }

    public function edit($id)
    {
        $apoderado = $this->service->obtener($id);
        if (! $apoderado) {
            abort(404);
        }
        return view('apoderados.edit', compact('apoderado'));
    }

    public function update(UpdateApoderadoRequest $request, $id)
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
