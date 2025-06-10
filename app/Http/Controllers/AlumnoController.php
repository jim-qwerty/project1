<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AlumnoService;
use Illuminate\Http\Request;
use App\Models\Alumno;

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
        // Si requieres listas de grados/secciones para el formulario:
        // $grados    = app(\App\Services\GradoService::class)->listar();
        // $secciones = app(\App\Services\SeccionService::class)->listar();
        // return view('alumnos.create', compact('grados', 'secciones'));
        return view('alumnos.create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombres'          => 'required|string|max:100',
            'apellidos'        => 'required|string|max:100',
            'dni'              => 'required|size:8|unique:alumnos,dni',
            'fecha_nacimiento' => 'required|date',
            'sexo'             => 'required|in:M,F',
            'direccion'        => 'nullable|string|max:200',
            'grado_id'         => 'required|exists:grados,id',
            'seccion_id'       => 'required|exists:secciones,id',
            'nivel_educativo'  => 'required|string|max:50',
            'edad'             => 'nullable|integer',
            'estado_matricula' => 'in:matriculado,en_proceso,retirado',
        ]);

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

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'nombres'          => 'sometimes|required|string|max:100',
            'apellidos'        => 'sometimes|required|string|max:100',
            'dni'              => "sometimes|required|size:8|unique:alumnos,dni,$id",
            'fecha_nacimiento' => 'sometimes|required|date',
            'sexo'             => 'sometimes|required|in:M,F',
            'direccion'        => 'nullable|string|max:200',
            'grado_id'         => 'sometimes|required|exists:grados,id',
            'seccion_id'       => 'sometimes|required|exists:secciones,id',
            'nivel_educativo'  => 'sometimes|required|string|max:50',
            'edad'             => 'nullable|integer',
            'estado_matricula' => 'in:matriculado,en_proceso,retirado',
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

    public function indexJson()
{
    // Asume que tu modelo Alumno carga grado y sección
    $alumnos = Alumno::with(['grado','seccion'])
        ->get()
        ->map(function($a) {
            return [
                'nombres'   => $a->nombres,
                'apellidos' => $a->apellidos,
                'grado'     => $a->grado->nombre,
                'seccion'   => $a->seccion->nombre,
                'estado'    => $a->estado_matricula,
            ];
        });
    return response()->json($alumnos);
}
}
