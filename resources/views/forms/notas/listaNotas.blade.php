
  <form id="formReporteNotas">
    <div class="filtros">
      <label>Grado:
        <select id="gradoSelect" name="grado">
          <option value="">--Selecciona--</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>

      <label>Sección:
        <select id="seccionSelect" name="seccion">
          <option value="">--Selecciona--</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </label>

      <label>Curso:
        <select id="cursoSelect" name="curso">
          <option value="">--Selecciona--</option>
          <option value="Matemática">Matemática</option>
          <option value="Comunicación">Comunicación</option>
        </select>
      </label>

      <label>Bimestre:
        <select id="bimestreSelect" name="bimestre">
          <option value="">--Selecciona--</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </label>
    </div>

    <div id="tablaNotas" class="tabla"></div>

    <button id="btnReporte" type="submit" style="display: none;">📄 Generar Reporte</button>
  </form>

