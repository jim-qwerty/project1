<?php

namespace App\Http\Controllers;

use App\Services\NotaService;
use App\Http\Requests\Nota\StoreNotaRequest;
use App\Http\Requests\Nota\UpdateNotaRequest;
use Illuminate\Validation\Rule;

class NotaController extends Controller
{
    public function __construct(protected NotaService $service) {}

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function create()
    {
        return view('notas.create');
    }

    public function store(StoreNotaRequest $request)
{
    $listas = $request->validated()['notas'];
    foreach ($listas as $datosNota) {
        $this->service->crear($datosNota);
    }
    return response()->json(['success' => true], 201);
}


    public function show($id)
    {
        $nota = $this->service->obtener($id);
        if (! $nota) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($nota);
    }

    public function edit($id)
    {
        $nota = $this->service->obtener($id);
        if (! $nota) {
            abort(404);
        }
        return view('notas.edit', compact('nota'));
    }

    public function update(UpdateNotaRequest $request, $id)
    {
        if (! $this->service->actualizar($id, $request->validated())) {
            return response()->json(['error' => 'No encontrado o no actualizado'], 404);
        }
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        if (! $this->service->eliminar($id)) {
            return response()->json(['error' => 'No encontrado o no eliminado'], 404);
        }
        return response()->json(['success' => true]);
    }

    public function indexJson(UpdateNotaRequest $request)
    {
        // reutiliza la validación del UpdateNotaRequest:
        $filters = $request->validated();
        return $this->service->listarPorFiltros($filters);
    }
}
