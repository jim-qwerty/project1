<?php

namespace App\Http\Controllers;

use App\Http\Requests\AsistenciaAlumno\StoreAsistenciaAlumnoRequest;
use App\Http\Requests\AsistenciaAlumno\UpdateAsistenciaAlumnoRequest;
use App\Http\Requests\AsistenciaAlumno\FiltrarAsistenciaAlumnoRequest;
use App\Services\AsistenciaAlumnoService;
use App\Models\AsistenciaAlumno;
use Illuminate\Support\Facades\Log;

class AsistenciaAlumnoController extends Controller
{
    protected AsistenciaAlumnoService $service;

    public function __construct(AsistenciaAlumnoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function create()
    {
        return view('asistencia-alumnos.create');
    }

    public function store(StoreAsistenciaAlumnoRequest $request)
    {
        foreach ($request->validated()['asistencias'] as $item) {
            $this->service->crear($item);
        }
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

    public function update(UpdateAsistenciaAlumnoRequest $request, $id)
    {
        $ok = $this->service->actualizar($id, $request->validated());
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

    public function filtrar(FiltrarAsistenciaAlumnoRequest $request)
    {
        $data = $request->validated();
        [$year, $month] = explode('-', $data['mes']);

        $asistencias = AsistenciaAlumno::where('grado_id', $data['grado_id'])
            ->where('seccion_id', $data['seccion_id'])
            ->whereYear('fecha', $year)
            ->whereMonth('fecha', $month)
            ->get(['alumno_id','fecha','estado']);

        return response()->json($asistencias);
    }
}
