<?php

namespace App\Http\Requests\AsistenciaAlumno;

use Illuminate\Foundation\Http\FormRequest;

class StoreAsistenciaAlumnoRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'asistencias'               => 'required|array',
            'asistencias.*.alumno_id'   => 'required|exists:alumnos,id',
            'asistencias.*.fecha'       => 'required|date',
            'asistencias.*.estado'      => 'required|in:P,T,F',
            'asistencias.*.grado_id'    => 'required|exists:grados,id',
            'asistencias.*.seccion_id'  => 'required|exists:secciones,id',
        ];
    }
}
