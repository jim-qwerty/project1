<?php

namespace App\Http\Controllers;

use App\Services\PagoService;
use App\Http\Requests\Pago\StorePagoRequest;
use App\Http\Requests\Pago\UpdatePagoRequest;

class PagoController extends Controller
{
    public function __construct(protected PagoService $service) {}

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function create()
    {
        return view('pagos.create');
    }

    public function store(StorePagoRequest $request)
    {
        $pago = $this->service->crear($request->validated());
        return response()->json($pago, 201);
    }

    public function show($id)
    {
        $pago = $this->service->obtener($id);
        if (! $pago) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($pago);
    }

    public function edit($id)
    {
        $pago = $this->service->obtener($id);
        if (! $pago) {
            abort(404);
        }
        return view('pagos.edit', compact('pago'));
    }

    public function update(UpdatePagoRequest $request, $id)
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
}
