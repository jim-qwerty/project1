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
            'alumno_id'     => 'required|integer|exists:alumnos,id',
            'grado_id'      => 'required|integer|exists:grados,id',
            'seccion_id'    => 'required|integer|exists:secciones,id',
            'curso_id'      => 'required|integer|exists:cursos,id',
            'docente_id'    => 'nullable|integer|exists:docentes,id',
            'bimestre'      => ['required', Rule::in(['I','II','III','IV'])],
            'competencia1'  => ['required', Rule::in(['A','B','C'])],
            'competencia2'  => ['required', Rule::in(['A','B','C'])],
            'competencia3'  => ['required', Rule::in(['A','B','C'])],
            'nota_final'    => ['required', Rule::in(['A','B','C'])],
        ];
    }
}
