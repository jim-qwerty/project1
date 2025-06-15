<?php

namespace App\Http\Controllers;

use App\Http\Requests\Docente\StoreDocenteRequest;
use App\Http\Requests\Docente\UpdateDocenteRequest;
use App\Http\Requests\Docente\FiltrarDocenteRequest;
use App\Services\DocenteService;
use App\Models\Docente;
use Illuminate\Support\Facades\Log;

class DocenteController extends Controller
{
    protected DocenteService $service;

    public function __construct(DocenteService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function create()
    {
        return view('docentes.create');
    }

    public function store(StoreDocenteRequest $request)
    {
        $this->service->crear($request->validated());
        return redirect()->back()->with('success', 'Docente registrado correctamente.');
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

    public function update(UpdateDocenteRequest $request, $id)
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

    public function filtrar(FiltrarDocenteRequest $request)
    {
        $q = $request->validated()['nombre'];

        try {
            $docentes = Docente::where('apellidos', 'like', "%{$q}%")
                ->orWhere('nombres', 'like', "%{$q}%")
                ->with(['gradoAsignado', 'seccionAsignada'])
                ->get();

            $result = $docentes->map(fn($d) => [
                'id'             => $d->id,
                'apellidos'      => $d->apellidos,
                'nombres'        => $d->nombres,
                'grado_nombre'   => optional($d->gradoAsignado)->nombre,
                'seccion_nombre' => optional($d->seccionAsignada)->nombre,
            ]);

            return response()->json($result);
        } catch (\Throwable $e) {
            Log::error('Error en DocenteController@filtrar: '.$e->getMessage());
            return response()->json(['error' => 'Error interno al buscar docentes'], 500);
        }
    }
}
