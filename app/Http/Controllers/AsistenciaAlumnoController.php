<?php

namespace App\Http\Controllers;

use App\Services\AsistenciaAlumnoService;
use Illuminate\Http\Request;

class AsistenciaAlumnoController extends Controller
{
    protected $service;

    public function __construct(AsistenciaAlumnoService $service)
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
        // Puedes pasar lista de alumnos, grados, secciones si necesitas selects:
        // $alumnos   = app(\App\Services\AlumnoService::class)->listar();
        // $grados    = app(\App\Services\GradoService::class)->listar();
        // $secciones = app(\App\Services\SeccionService::class)->listar();
        // return view('asistencia-alumnos.create', compact('alumnos','grados','secciones'));
        return view('asistencia-alumnos.create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
        'asistencias'                 => 'required|array',
        'asistencias.*.alumno_id'     => 'required|exists:alumnos,id',
        'asistencias.*.fecha'         => 'required|date',
        'asistencias.*.estado'        => 'required|in:P,T,F',
        'asistencias.*.grado_id'      => 'required|exists:grados,id',
        'asistencias.*.seccion_id'    => 'required|exists:secciones,id',
    ]);

    // Inserción masiva
    \App\Models\AsistenciaAlumno::insert($datos['asistencias']);

    return response()->json(['success' => true], 201);
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
        return view('asistencia-alumnos.edit', compact('asistencia'));
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'alumno_id'    => 'sometimes|required|exists:alumnos,id',
            'fecha'        => 'sometimes|required|date',
            'estado'       => 'sometimes|required|in:P,T,F',
            
            'grado_id'     => 'sometimes|required|exists:grados,id',
            'seccion_id'   => 'sometimes|required|exists:secciones,id',
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
