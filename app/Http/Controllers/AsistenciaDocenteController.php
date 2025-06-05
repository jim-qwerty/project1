<?php

namespace App\Http\Controllers;

use App\Services\AsistenciaDocenteService;
use Illuminate\Http\Request;

class AsistenciaDocenteController extends Controller
{
    protected $service;

    public function __construct(AsistenciaDocenteService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $asistencias = $this->service->listar();
        return response()->json($asistencias);
    }

    public function create()
    {
        // Si requieres lista de docentes:
        // $docentes = app(\App\Services\DocenteService::class)->listar();
        // return view('asistencia-docentes.create', compact('docentes'));
        return view('asistencia-docentes.create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'docente_id'   => 'required|exists:docentes,id',
            'fecha'        => 'required|date',
            'estado'       => 'required|in:P,T,F',
            'hora_registro'=> 'nullable|date_format:H:i:s',
        ]);

        $asistencia = $this->service->crear($datos);
        return response()->json($asistencia, 201);
    }

    public function show($id)
    {
        $asistencia = $this->service->obtener($id);
        if (! $asistencia) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($asistencia);
    }

    public function edit($id)
    {
        $asistencia = $this->service->obtener($id);
        if (! $asistencia) {
            abort(404);
        }
        return view('asistencia-docentes.edit', compact('asistencia'));
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'docente_id'   => 'sometimes|required|exists:docentes,id',
            'fecha'        => 'sometimes|required|date',
            'estado'       => 'sometimes|required|in:P,T,F',
            'hora_registro'=> 'nullable|date_format:H:i:s',
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
