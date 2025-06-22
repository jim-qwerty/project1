<?php

namespace App\Http\Requests\Nota;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNotaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'notas'                  => 'required|array|min:1',
            'notas.*.alumno_id'      => 'required|integer|exists:alumnos,id',
            'notas.*.grado_id'       => 'required|integer|exists:grados,id',
            'notas.*.seccion_id'     => 'required|integer|exists:secciones,id',
            'notas.*.curso_id'       => 'required|integer|exists:cursos,id',
            'notas.*.docente_id'     => 'nullable|integer|exists:docentes,id',
            'notas.*.bimestre'       => ['required', Rule::in(['I','II','III','IV'])],
            'notas.*.competencia1'   => ['required', Rule::in(['A','B','C'])],
            'notas.*.competencia2'   => ['required', Rule::in(['A','B','C'])],
            'notas.*.competencia3'   => ['required', Rule::in(['A','B','C'])],
            'notas.*.nota_final'     => ['required', Rule::in(['A','B','C'])],
        ];
    }
}

