<!-- listaMatriculas.blade.php -->
<div class="lm-wrapper">
  <form id="form-alumnos" class="lm-form">
    <h2 class="lm-titulo">Lista de Matrículas</h2>

    <div class="lm-filters">
      <div class="lm-buscador-wrapper">
        <input type="text" id="buscador" class="lm-input" placeholder="Buscar por nombre o apellido" autocomplete="off">
        <div id="sugerenciasNombres" class="lm-sugerencias"></div>
      </div>

      <select id="filtro-grado" class="lm-select">
        <option value="">Todos los grados</option>
        <option value="Primero">Primero</option>
        <option value="Segundo">Segundo</option>
        <option value="Tercero">Tercero</option>
      </select>

      <select id="filtro-seccion" class="lm-select">
        <option value="">Todas las secciones</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    </div>

    <table id="tabla-alumnos" class="lm-tabla">
      <thead>
        <tr>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Grado</th>
          <th>Sección</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <!-- Vacío al inicio -->
      </tbody>
    </table>

    <button id="guardar-btn" type="button" class="lm-btn">Guardar Cambios</button>
    <div id="mensaje-confirmacion" class="lm-confirmacion">Cambios guardados correctamente.</div>
  </form>
</div>
