<div class="ln-wrapper">
  <form id="formReporteNotas" class="ln-form">
    <h2 class="ln-title">Reporte de Notas</h2>

    <div class="ln-filtros">
      <label class="ln-label">Grado:
        <input type="text" id="gradoSelect" name="grado" class="ln-input" placeholder="Ej. 1">
      </label>

      <label class="ln-label">Sección:
        <input type="text" id="seccionSelect" name="seccion" class="ln-input" placeholder="Ej. A">
      </label>

      <label class="ln-label">Curso:
        <select id="cursoSelect" name="curso" class="ln-select">
          <option value="">--Selecciona--</option>
          <option value="Matemática">Matemática</option>
          <option value="Comunicación">Comunicación</option>
        </select>
      </label>

      <label class="ln-label">Bimestre:
        <select id="bimestreSelect" name="bimestre" class="ln-select">
          <option value="">--Selecciona--</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </label>
    </div>

    <div id="tablaNotas" class="ln-tabla-contenedor">
      <table class="ln-tabla">
        <thead>
          <tr>
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

    <button id="btnReporte" type="submit" class="ln-btn">📄 Generar Reporte</button>
  </form>
</div>


