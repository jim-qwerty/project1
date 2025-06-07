<?php

namespace App\Http\Controllers;

use App\Services\UsuarioService;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    protected $service;

    public function __construct(UsuarioService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $usuarios = $this->service->listar();
        return response()->json($usuarios);
    }

      public function create()
    {
        return view('forms.gestionUsuarios.crearUsuarios');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'username'      => 'required|string|max:50|unique:usuarios,username',
            'password_hash' => 'required|string',
            'rol'           => 'required|in:admin,profesor',
            'docente_id'    => 'nullable|exists:docentes,id',
            'nombres'       => 'required|string|max:100',
            'apellidos'     => 'required|string|max:100',
            'estado'        => 'in:activo,inactivo',
        ]);

        $usuario = $this->service->crear($datos);

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
        return view('usuarios.edit', compact('usuario'));
    }

    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'username'      => "sometimes|required|string|max:50|unique:usuarios,username,$id",
            'password_hash' => 'sometimes|required|string',
            'rol'           => 'sometimes|required|in:admin,profesor',
            'docente_id'    => 'nullable|exists:docentes,id',
            'estado'        => 'in:activo,inactivo',
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
