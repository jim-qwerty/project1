<form id="formularioNotas">
  <div class="input-group">
    <label>Grado:
      <select id="gradoSelect">
        <option value="">Seleccionar</option>
        <option value="1">1°</option>
        <option value="2">2°</option>
        <option value="3">3°</option>
      </select>
    </label>

    <label>Sección:
      <select id="seccionSelect">
        <option value="">Seleccionar</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>
    </label>

    <label>Curso:
      <select id="cursoSelect">
        <option value="">Seleccionar</option>
        <option value="Matemática">Matemática</option>
        <option value="Comunicación">Comunicación</option>
        <option value="Ciencia y Tecnología">Ciencia y Tecnología</option>
        <option value="Personal Social">Personal Social</option>
        <option value="Educación Física">Educación Física</option>
      </select>
    </label>

    <label>Bimestre:
      <select id="bimestreSelect">
        <option value="">Seleccionar</option>
        <option value="1">1° Bimestre</option>
        <option value="2">2° Bimestre</option>
        <option value="3">3° Bimestre</option>
        <option value="4">4° Bimestre</option>
      </select>
    </label>
  </div>

  <div id="panelNotas" style="display:none">
    <label>Buscar alumno:
      <input type="text" id="buscarAlumno" placeholder="Nombre">
    </label>
    <ul id="listaResultados"></ul>

    <table>
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
            <div class="radio-group">
              <label><input type="radio" name="c1" value="A">A</label>
              <label><input type="radio" name="c1" value="B">B</label>
              <label><input type="radio" name="c1" value="C">C</label>
            </div>
          </td>
          <td>
            <div class="radio-group">
              <label><input type="radio" name="c2" value="A">A</label>
              <label><input type="radio" name="c2" value="B">B</label>
              <label><input type="radio" name="c2" value="C">C</label>
            </div>
          </td>
          <td>
            <div class="radio-group">
              <label><input type="radio" name="c3" value="A">A</label>
              <label><input type="radio" name="c3" value="B">B</label>
              <label><input type="radio" name="c3" value="C">C</label>
            </div>
          </td>
          <td>
            <div class="radio-group">
              <label><input type="radio" name="final" value="A">A</label>
              <label><input type="radio" name="final" value="B">B</label>
              <label><input type="radio" name="final" value="C">C</label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <button type="button" id="btnSiguiente">Siguiente Alumno</button>

    <br><br>
    <button type="submit">Guardar Notas</button>
    <p id="mensajeConfirmacion"></p>
  </div>
</form>
