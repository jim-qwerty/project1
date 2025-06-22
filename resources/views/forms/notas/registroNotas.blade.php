{{-- resources/views/forms/notas/registroNotas.blade.php --}}

<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="rn-wrapper">
  <form id="formularioNotas" class="rn-form">
    <h2>Registro de Notas</h2>

    <div class="rn-input-group">
      <!-- GRADO como select -->
      <label class="rn-label">Grado:
        <select id="gradoSelect" class="rn-select">
          <option value="">Seleccionar grado</option>
        </select>
      </label>

      <!-- SECCIÓN como select -->
      <label class="rn-label">Sección:
        <select id="seccionSelect" class="rn-select">
          <option value="">Seleccionar sección</option>
        </select>
      </label>

      <!-- CURSO como select vacío -->
      <label class="rn-label">Curso:
        <select id="cursoSelect" class="rn-select">
          <option value="">Seleccionar curso</option>
        </select>
      </label>

      <!-- BIMESTRE como select vacío -->
      <label class="rn-label">Bimestre:
        <select id="bimestreSelect" class="rn-select">
          <option value="">Seleccionar bimestre</option>
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
