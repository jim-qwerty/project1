<div class="rn-wrapper">
  <form id="formularioNotas" class="rn-form">
    <div class="rn-input-group">
      <label class="rn-label">Grado:
        <select id="gradoSelect" class="rn-select">
          <option value="">Seleccionar</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
          <option value="3">3°</option>
        </select>
      </label>

      <label class="rn-label">Sección:
        <select id="seccionSelect" class="rn-select">
          <option value="">Seleccionar</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </label>

      <label class="rn-label">Curso:
        <select id="cursoSelect" class="rn-select">
          <option value="">Seleccionar</option>
          <option value="Matemática">Matemática</option>
          <option value="Comunicación">Comunicación</option>
          <option value="Ciencia y Tecnología">Ciencia y Tecnología</option>
          <option value="Personal Social">Personal Social</option>
          <option value="Educación Física">Educación Física</option>
        </select>
      </label>

      <label class="rn-label">Bimestre:
        <select id="bimestreSelect" class="rn-select">
          <option value="">Seleccionar</option>
          <option value="1">1° Bimestre</option>
          <option value="2">2° Bimestre</option>
          <option value="3">3° Bimestre</option>
          <option value="4">4° Bimestre</option>
        </select>
      </label>
    </div>

    <div id="panelNotas" class="rn-panel" style="display:none">
      <label class="rn-label">Buscar alumno:
        <input type="text" id="buscarAlumno" class="rn-input" placeholder="Nombre">
      </label>
      <ul id="listaResultados" class="rn-resultados"></ul>

      <table class="rn-tabla">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Alumno</th>
            <th>Competencia 1</th>
            <th>Competencia 2</th>
            <th>Competencia 3</th>
            <th>Nota Final</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td id="nombreAlumno">---</td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="c1" value="A">A</label>
                <label><input type="radio" name="c1" value="B">B</label>
                <label><input type="radio" name="c1" value="C">C</label>
              </div>
            </td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="c2" value="A">A</label>
                <label><input type="radio" name="c2" value="B">B</label>
                <label><input type="radio" name="c2" value="C">C</label>
              </div>
            </td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="c3" value="A">A</label>
                <label><input type="radio" name="c3" value="B">B</label>
                <label><input type="radio" name="c3" value="C">C</label>
              </div>
            </td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="final" value="A">A</label>
                <label><input type="radio" name="final" value="B">B</label>
                <label><input type="radio" name="final" value="C">C</label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="button" id="btnSiguiente" class="rn-btn">Siguiente Alumno</button>
      <br><br>
      <button type="submit" class="rn-btn">Guardar Notas</button>
      <p id="mensajeConfirmacion" class="rn-confirmacion"></p>
    </div>
  </form>
</div>
