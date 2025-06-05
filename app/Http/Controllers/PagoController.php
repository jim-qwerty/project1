<?php

namespace App\Http\Controllers;

use App\Services\PagoService;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    protected $service;

    public function __construct(PagoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $pagos = $this->service->listar();
        return response()->json($pagos);
    }

    public function show($id)
    {
        $pago = $this->service->obtener($id);
        if (! $pago) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($pago);
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'alumno_id'       => 'required|exists:alumnos,id',
            'tipo_pago'       => 'required|in:matricula,mensualidad',
            'grado_id'        => 'required|exists:grados,id',
            'seccion_id'      => 'required|exists:secciones,id',
            'mes'             => 'nullable|integer',
            'año'             => 'required|integer',
            'fecha_pago'      => 'required|date',
            'monto'           => 'required|numeric',
            'metodo_pago'     => 'nullable|string|max:50',
            'observacion'     => 'nullable|string',
        ]);

        $pago = $this->service->crear($datos);
        return response()->json($pago, 201);
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'alumno_id'       => 'sometimes|required|exists:alumnos,id',
            'tipo_pago'       => 'sometimes|required|in:matricula,mensualidad',
            'grado_id'        => 'sometimes|required|exists:grados,id',
            'seccion_id'      => 'sometimes|required|exists:secciones,id',
            'mes'             => 'nullable|integer',
            'año'             => 'sometimes|required|integer',
            'fecha_pago'      => 'sometimes|required|date',
            'monto'           => 'sometimes|required|numeric',
            'metodo_pago'     => 'nullable|string|max:50',
            'observacion'     => 'nullable|string',
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
