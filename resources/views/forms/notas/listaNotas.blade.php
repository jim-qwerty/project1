<div class="ln-wrapper">
  <form id="formReporteNotas" class="ln-form">
    <div class="ln-filtros">
      <label class="ln-label">Grado:
        <select id="gradoSelect" name="grado" class="ln-select">
          <option value="">--Selecciona--</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>

      <label class="ln-label">Sección:
        <select id="seccionSelect" name="seccion" class="ln-select">
          <option value="">--Selecciona--</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
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

    <div id="tablaNotas" class="ln-tabla"></div>

    <button id="btnReporte" type="submit" class="ln-btn" style="display: none;">📄 Generar Reporte</button>
  </form>
</div>
