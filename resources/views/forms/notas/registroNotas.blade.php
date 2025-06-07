{{-- resources/views/registroNotas.blade.php --}}
<div class="rn-wrapper">
  <form id="formularioNotas" class="rn-form">
    <h2>Registro de Notas</h2>

    <div class="rn-input-group">
      <!-- GRADO como campo de texto -->
      <label class="rn-label">Grado:
        <input
          type="text"
          id="gradoSelect"
          class="rn-input"
          placeholder="Ej. 1°"
        >
      </label>

      <!-- SECCIÓN como campo de texto -->
      <label class="rn-label">Sección:
        <input
          type="text"
          id="seccionSelect"
          class="rn-input"
          placeholder="Ej. A"
        >
      </label>

      <!-- CURSO sigue siendo select -->
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

      <!-- BIMESTRE sigue siendo select -->
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

    <div id="panelNotas" class="rn-panel">
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
          {{-- JS inyectará aquí una fila por cada alumno --}}
        </tbody>
      </table>

      <button type="button" id="btnSiguiente" class="rn-btn">Siguiente Alumno</button>
      <br><br>
      <button type="submit" class="rn-btn">Guardar Notas</button>
      <p id="mensajeConfirmacion" class="rn-confirmacion"></p>
    </div>
  </form>
</div>


