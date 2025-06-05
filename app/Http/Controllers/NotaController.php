<?php

namespace App\Http\Controllers;

use App\Services\NotaService;
use Illuminate\Http\Request;

class NotaController extends Controller
{
    protected $service;

    public function __construct(NotaService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $notas = $this->service->listar();
        return response()->json($notas);
    }

    public function create()
    {
        // Si necesitas listas de alumnos, grados, secciones, cursos o docentes:
        // $alumnos = app(\App\Services\AlumnoService::class)->listar();
        // $grados = app(\App\Services\GradoService::class)->listar();
        // $secciones = app(\App\Services\SeccionService::class)->listar();
        // $cursos = app(\App\Services\CursoService::class)->listar();
        // $docentes = app(\App\Services\DocenteService::class)->listar();
        // return view('notas.create', compact('alumnos','grados','secciones','cursos','docentes'));
        return view('notas.create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'alumno_id'     => 'required|exists:alumnos,id',
            'grado_id'      => 'required|exists:grados,id',
            'seccion_id'    => 'required|exists:secciones,id',
            'curso_id'      => 'required|exists:cursos,id',
            'bimestre'      => 'required|in:I,II,III,IV',
            'competencia1'  => 'required|in:A,B,C',
            'competencia2'  => 'required|in:A,B,C',
            'competencia3'  => 'required|in:A,B,C',
            'nota_final'    => 'required|in:A,B,C',
            'docente_id'    => 'nullable|exists:docentes,id',
        ]);

        $nota = $this->service->crear($datos);
        return response()->json($nota, 201);
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

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'alumno_id'     => 'sometimes|required|exists:alumnos,id',
            'grado_id'      => 'sometimes|required|exists:grados,id',
            'seccion_id'    => 'sometimes|required|exists:secciones,id',
            'curso_id'      => 'sometimes|required|exists:cursos,id',
            'bimestre'      => 'sometimes|required|in:I,II,III,IV',
            'competencia1'  => 'sometimes|required|in:A,B,C',
            'competencia2'  => 'sometimes|required|in:A,B,C',
            'competencia3'  => 'sometimes|required|in:A,B,C',
            'nota_final'    => 'sometimes|required|in:A,B,C',
            'docente_id'    => 'nullable|exists:docentes,id',
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
