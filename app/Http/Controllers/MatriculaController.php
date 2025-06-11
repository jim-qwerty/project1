<?php

namespace App\Http\Controllers;

use App\Services\MatriculaService;
use Illuminate\Http\Request;

class MatriculaController extends Controller
{
    protected $service;

    public function __construct(MatriculaService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $matriculas = $this->service->listar();
        return response()->json($matriculas);
    }

    public function create()
    {
        // Si necesitas listas de alumnos para el select:
        // $alumnos = app(\App\Services\AlumnoService::class)->listar();
        // return view('matriculas.create', compact('alumnos'));
        return view('matriculas.create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'alumno_id'       => 'required|exists:alumnos,id',
            
            'monto'           => 'required|numeric',
            'metodo_pago'     => 'nullable|string|max:50',
            'fecha_pago'      => 'nullable|date',
            'observacion'     => 'nullable|string',
            'estado_pago'     => 'in:pagado,pendiente',
        ]);

        $matricula = $this->service->crear($datos);
        return response()->json($matricula, 201);
    }

    public function show($id)
    {
        $matricula = $this->service->obtener($id);
        if (! $matricula) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($matricula);
    }

    public function edit($id)
    {
        $matricula = $this->service->obtener($id);
        if (! $matricula) {
            abort(404);
        }
        return view('matriculas.edit', compact('matricula'));
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'alumno_id'   => 'required|exists:alumnos,id',
        'monto'       => 'required|numeric',
        'metodo_pago' => 'nullable|string|max:50',
        'fecha_pago'  => 'required|date',
        'observacion' => 'nullable|string',
        'estado_pago' => 'required|in:pagado,pendiente',
        ]);

        $matricula = $this->service->crear($datos);
    return response()->json($matricula, 201);;
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
