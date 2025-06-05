<?php

namespace App\Http\Controllers;

use App\Services\ApoderadoService;
use Illuminate\Http\Request;

class ApoderadoController extends Controller
{
    protected $service;

    public function __construct(ApoderadoService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $apoderados = $this->service->listar();
        return response()->json($apoderados);
    }

    public function create()
    {
        // Si deseas pasar lista de alumnos para el select:
        // $alumnos = app(\App\Services\AlumnoService::class)->listar();
        // return view('apoderados.create', compact('alumnos'));
        return view('apoderados.create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'alumno_id'        => 'required|exists:alumnos,id',
            'nombres'          => 'required|string|max:100',
            'apellidos'        => 'required|string|max:100',
            'dni'              => 'nullable|size:8',
            'parentesco'       => 'nullable|string|max:50',
            'celular'          => 'nullable|size:9',
            'correo_electronico'=> 'nullable|email|max:100',
        ]);

        $apoderado = $this->service->crear($datos);
        return response()->json($apoderado, 201);
    }

    public function show($id)
    {
        $apoderado = $this->service->obtener($id);
        if (! $apoderado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($apoderado);
    }

    public function edit($id)
    {
        $apoderado = $this->service->obtener($id);
        if (! $apoderado) {
            abort(404);
        }
        return view('apoderados.edit', compact('apoderado'));
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'alumno_id'        => 'sometimes|required|exists:alumnos,id',
            'nombres'          => 'sometimes|required|string|max:100',
            'apellidos'        => 'sometimes|required|string|max:100',
            'dni'              => 'nullable|size:8',
            'parentesco'       => 'nullable|string|max:50',
            'celular'          => 'nullable|size:9',
            'correo_electronico'=> 'nullable|email|max:100',
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
