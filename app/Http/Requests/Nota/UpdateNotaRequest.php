<?php

namespace App\Http\Requests\Nota;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNotaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'alumno_id'     => 'sometimes|required|integer|exists:alumnos,id',
            'grado_id'      => 'sometimes|required|integer|exists:grados,id',
            'seccion_id'    => 'sometimes|required|integer|exists:secciones,id',
            'curso_id'      => 'sometimes|required|integer|exists:cursos,id',
            'docente_id'    => 'sometimes|nullable|integer|exists:docentes,id',
            'bimestre'      => ['sometimes','required', Rule::in(['I','II','III','IV'])],
            'competencia1'  => ['sometimes','required', Rule::in(['A','B','C'])],
            'competencia2'  => ['sometimes','required', Rule::in(['A','B','C'])],
            'competencia3'  => ['sometimes','required', Rule::in(['A','B','C'])],
            'nota_final'    => ['sometimes','required', Rule::in(['A','B','C'])],
        ];
    }
}
