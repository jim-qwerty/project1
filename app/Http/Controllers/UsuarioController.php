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

    // GET /usuarios (JSON)
    public function index()
    {
        $usuarios = $this->service->listar();
        return response()->json($usuarios);
    }

    // GET /usuarios/create
    public function create()
    {
        return view('forms.gestionUsuarios.crearUsuarios');
    }

    // POST /usuarios
    public function store(Request $request)
    {
        $datos = $request->validate([
            'username'              => 'required|string|max:50|unique:usuarios,username',
            'password'              => 'required|string|min:6|confirmed',
            'rol'                   => 'required|in:admin,profesor',
            'docente_id'            => 'nullable|exists:docentes,id',
            'nombres'               => 'required|string|max:100',
            'apellidos'             => 'required|string|max:100',
        ]);

        // Transformamos para el service
        $datos['password_hash'] = $datos['password'];
        unset($datos['password'], $datos['password_confirmation']);

        $usuario = $this->service->crear($datos);
        return response()->json($usuario, 201);
    }

    // GET /usuarios/{id}
    public function show($id)
    {
        $usuario = $this->service->obtener($id);
        if (! $usuario) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($usuario);
    }

    // GET /usuarios/{id}/edit
    public function edit($id)
    {
        $usuario = $this->service->obtener($id);
        if (! $usuario) {
            abort(404);
        }
        return view('usuarios.edit', compact('usuario'));
    }

    // PUT/PATCH /usuarios/{id}
    public function update(Request $request, $id)
    {
        $datos = $request->validate([
            'username'              => "sometimes|required|string|max:50|unique:usuarios,username,{$id}",
            'password'              => 'sometimes|required|string|min:6|confirmed',
            'rol'                   => 'sometimes|required|in:admin,profesor',
            'docente_id'            => 'nullable|exists:docentes,id',
            'estado'                => 'sometimes|required|in:activo,inactivo',
        ]);

        // Si viene nueva contraseña, la preparamos
        if (isset($datos['password'])) {
            $datos['password_hash'] = $datos['password'];
            unset($datos['password'], $datos['password_confirmation']);
        }

        $ok = $this->service->actualizar($id, $datos);
        if (! $ok) {
            return response()->json(['error' => 'No encontrado o no actualizado'], 404);
        }
        return response()->json(['success' => true]);
    }

    // DELETE /usuarios/{id}
    public function destroy($id)
    {
        $ok = $this->service->eliminar($id);
        if (! $ok) {
            return response()->json(['error' => 'No encontrado o no eliminado'], 404);
        }
        return response()->json(['success' => true]);
    }
}
