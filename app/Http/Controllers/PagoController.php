<?php

namespace App\Http\Controllers;

use App\Services\PagoService;
use App\Http\Requests\Pago\StorePagoRequest;
use App\Http\Requests\Pago\UpdatePagoRequest;
use App\Http\Requests\Pago\FiltrarPagoRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PagoController extends Controller
{
    protected PagoService $service;

    public function __construct(PagoService $service)
    {
        $this->service = $service;
    }

    /**
     * Lista todos los pagos.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(
            $this->service->listar()
        );
    }

    /**
     * Filtra pagos por grado, sección y mes.
     *
     * @param  FiltrarPagoRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function filtrar(FiltrarPagoRequest $request)
    {
        $filtros = $request->validated(); // ['grado_id','seccion_id','mes']
        $pagos   = $this->service->filtrar($filtros);

        return response()->json($pagos);
    }

    /**
     * Muestra el formulario de creación de pago.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return view('pagos.create');
    }

    /**
     * Almacena un nuevo pago.
     *
     * @param  StorePagoRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StorePagoRequest $request)
    {
        $pago = $this->service->crear($request->validated());

        return response()->json($pago, Response::HTTP_CREATED);
    }

    /**
     * Obtiene un pago por ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id)
    {
        $pago = $this->service->obtener($id);

        if (! $pago) {
            return response()->json(['error' => 'No encontrado'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($pago);
    }

    /**
     * Muestra el formulario de edición de un pago.
     *
     * @param  int  $id
     * @return \Illuminate\View\View
     */
    public function edit(int $id)
    {
        $pago = $this->service->obtener($id);

        if (! $pago) {
            abort(Response::HTTP_NOT_FOUND);
        }

        return view('pagos.edit', compact('pago'));
    }

    /**
     * Actualiza un pago existente.
     *
     * @param  UpdatePagoRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdatePagoRequest $request, int $id)
    {
        $updated = $this->service->actualizar($id, $request->validated());

        if (! $updated) {
            return response()->json(['error' => 'No encontrado o no actualizado'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Elimina un pago.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $deleted = $this->service->eliminar($id);

        if (! $deleted) {
            return response()->json(['error' => 'No encontrado o no eliminado'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Devuelve los alumnos que no tienen registro de pago para el grado, sección y mes indicados.
     *
     * @param  FiltrarPagoRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deudores(FiltrarPagoRequest $request)
    {
        $g = $request->grado_id;
        $s = $request->seccion_id;
        $m = $request->mes;

        $deudores = DB::table('alumnos as a')
            ->leftJoin('pagos as p', function($join) use ($g, $s, $m) {
                $join->on('p.alumno_id', '=', 'a.id')
                     ->where('p.grado_id',   $g)
                     ->where('p.seccion_id', $s)
                     ->where('p.mes',        $m);
            })
            ->where('a.grado_id',   $g)
            ->where('a.seccion_id', $s)
            ->whereNull('p.id')
            ->select(
                'a.id',
                DB::raw("CONCAT(a.nombres, ' ', a.apellidos) AS alumno")
            )
            ->get();

        return response()->json($deudores);
    }
}
