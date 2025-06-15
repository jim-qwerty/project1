<?php

namespace App\Http\Controllers;

use App\Services\UsuarioService;
use App\Http\Requests\Usuario\StoreUsuarioRequest;
use App\Http\Requests\Usuario\UpdateUsuarioRequest;

class UsuarioController extends Controller
{
    public function __construct(protected UsuarioService $service) {}

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function create()
    {
        return view('forms.gestionUsuarios.crearUsuarios');
    }

    public function store(StoreUsuarioRequest $request)
    {
        $data = $request->validated();
        $usuario = $this->service->crear($data);
        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        $usuario = $this->service->obtener($id);
        if (! $usuario) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($usuario);
    }

    public function edit($id)
    {
        $usuario = $this->service->obtener($id);
        if (! $usuario) {
            abort(404);
        }
        return view('forms.gestionUsuarios.editarUsuarios', compact('usuario'));
    }

    public function update(UpdateUsuarioRequest $request, $id)
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
}
