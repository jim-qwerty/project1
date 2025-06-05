<?php

namespace App\Http\Controllers;

use App\Services\DocenteService;
use Illuminate\Http\Request;

class DocenteController extends Controller
{
    protected $service;

    public function __construct(DocenteService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $docentes = $this->service->listar();
        return response()->json($docentes);
    }

    public function create()
    {
        // Si requieres listas de grados/secciones:
        // $grados    = app(\App\Services\GradoService::class)->listar();
        // $secciones = app(\App\Services\SeccionService::class)->listar();
        // return view('docentes.create', compact('grados', 'secciones'));
        return view('docentes.create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombres'               => 'required|string|max:100',
            'apellidos'             => 'required|string|max:100',
            'dni'                   => 'required|size:8|unique:docentes,dni',
            'fecha_nacimiento'      => 'required|date',
            'edad'                  => 'nullable|integer',
            'grado_asignado_id'     => 'nullable|exists:grados,id',
            'seccion_asignada_id'   => 'nullable|exists:secciones,id',
            'correo_electronico'    => 'nullable|email|max:100',
            'celular'               => 'nullable|size:9',
            'direccion'             => 'nullable|string|max:200',
            'sexo'                  => 'required|in:M,F',
            'estado'                => 'in:activo,inactivo',
        ]);

        $docente = $this->service->crear($datos);
        return response()->json($docente, 201);
    }

    public function show($id)
    {
        $docente = $this->service->obtener($id);
        if (! $docente) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($docente);
    }

    public function edit($id)
    {
        $docente = $this->service->obtener($id);
        if (! $docente) {
            abort(404);
        }
        return view('docentes.edit', compact('docente'));
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'nombres'               => 'sometimes|required|string|max:100',
            'apellidos'             => 'sometimes|required|string|max:100',
            'dni'                   => "sometimes|required|size:8|unique:docentes,dni,$id",
            'fecha_nacimiento'      => 'sometimes|required|date',
            'edad'                  => 'nullable|integer',
            'grado_asignado_id'     => 'nullable|exists:grados,id',
            'seccion_asignada_id'   => 'nullable|exists:secciones,id',
            'correo_electronico'    => 'nullable|email|max:100',
            'celular'               => 'nullable|size:9',
            'direccion'             => 'nullable|string|max:200',
            'sexo'                  => 'sometimes|required|in:M,F',
            'estado'                => 'in:activo,inactivo',
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
