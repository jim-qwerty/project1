{{-- resources/views/listaNotas.blade.php --}}
<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="ln-wrapper">
  <form id="formReporteNotas" class="ln-form">
    <h2 class="ln-title">Reporte de Notas</h2>

    <div class="ln-filtros">
      <label class="ln-label">Grado:
        <select id="gradoSelect" name="grado" class="ln-select">
          <option value="">--Selecciona grado--</option>
        </select>
      </label>

      <label class="ln-label">Sección:
        <select id="seccionSelect" name="seccion" class="ln-select">
          <option value="">--Selecciona sección--</option>
        </select>
      </label>

      <label class="ln-label">Curso:
        <select id="cursoSelect" name="curso" class="ln-select">
          <option value="">--Selecciona curso--</option>
        </select>
      </label>

      <label class="ln-label">Bimestre:
        <select id="bimestreSelect" name="bimestre" class="ln-select">
          <option value="">--Selecciona bimestre--</option>
        </select>
      </label>
    </div>

    <div id="tablaNotas" class="ln-tabla-contenedor">
      <table class="ln-tabla">
        <thead>
          <tr>
            <th>N°</th>
            <th>Alumno</th>
            <th>Competencia 1</th>
            <th>Competencia 2</th>
            <th>Competencia 3</th>
            <th>Nota Final</th>
          </tr>
        </thead>
        <tbody>
          {{-- JS inyecta aquí las filas sólo cuando completan filtros --}}
        </tbody>
      </table>
    </div>

    <button id="btnReporte" type="button" class="ln-btn" style="display:none">
      📄 Generar Reporte
    </button>
  </form>
</div>


