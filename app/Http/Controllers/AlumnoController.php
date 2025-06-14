<?php

namespace App\Http\Controllers;

use App\Http\Requests\Alumno\StoreAlumnoRequest;
use App\Http\Requests\Alumno\UpdateAlumnoRequest;
use App\Http\Requests\Alumno\FiltrarAlumnoRequest;
use App\Http\Requests\Alumno\UpdateEstadosAlumnoRequest;
use App\Services\AlumnoService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AlumnoController extends Controller
{
    protected $service;

    public function __construct(AlumnoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $alumnos = $this->service->listar();
        return response()->json($alumnos);
    }

    public function create()
    {
        return view('alumnos.create');
    }

    public function store(StoreAlumnoRequest $request)
    {
        $datos  = $request->validated();
        $alumno = $this->service->crear($datos);
        return response()->json($alumno, 201);
    }

    public function show($id)
    {
        $alumno = $this->service->obtener($id);
        if (! $alumno) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($alumno);
    }

    public function edit($id)
    {
        $alumno = $this->service->obtener($id);
        if (! $alumno) {
            abort(404);
        }
        return view('alumnos.edit', compact('alumno'));
    }

    public function update(UpdateAlumnoRequest $request, $id)
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

    public function indexJson()
    {
        $alumnos = \App\Models\Alumno::with(['grado', 'seccion'])
            ->get()
            ->map(function($a) {
                return [
                    'id'        => $a->id,
                    'nombres'   => $a->nombres,
                    'apellidos' => $a->apellidos,
                    'grado'     => $a->grado->nombre,
                    'seccion'   => $a->seccion->nombre,
                    'estado'    => ucfirst($a->estado_matricula),
                ];
            });

        return response()->json($alumnos);
    }

    public function filtrar(FiltrarAlumnoRequest $request)
    {
        $data = $request->validated();
        $alumnos = \App\Models\Alumno::where('grado_id', $data['grado_id'])
            ->where('seccion_id', $data['seccion_id'])
            ->get(['id','nombres','apellidos'])
            ->map(function($a) {
                return [
                    'id'              => $a->id,
                    'nombre_completo' => trim("{$a->nombres} {$a->apellidos}"),
                ];
            })
            ->values();

        return response()->json($alumnos);
    }

    public function updateEstados(UpdateEstadosAlumnoRequest $request)
    {
        $data = $request->validated();
        foreach ($data['updates'] as $u) {
            \App\Models\Alumno::where('id', $u['id'])
                ->update([
                    'estado_matricula' => Str::slug($u['estado'], '_'),
                ]);
        }

        return response()->json(['success' => true]);
    }
}
