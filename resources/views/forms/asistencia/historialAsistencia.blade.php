<div class="ha-wrapper">
  <div class="ha-form">
    <h2 class="ha-titulo">Resumen Mensual de Asistencia</h2>

    <div class="ha-form-group">
      <label for="grado" class="ha-label">Grado:</label>
      <input type="text" id="grado" class="ha-input" placeholder="Ej. 1°">
    </div>

    <div class="ha-form-group">
      <label for="seccion" class="ha-label">Sección:</label>
      <input type="text" id="seccion" class="ha-input" placeholder="Ej. A">
    </div>

    <div class="ha-form-group ha-autocomplete">
      <label for="nombreAlumno" class="ha-label">Nombre del alumno:</label>
      <input
        type="text"
        id="nombreAlumno"
        class="ha-input"
        placeholder="Buscar por nombre"
        autocomplete="off"
      >
      <ul id="suggestions" class="ha-suggestions"></ul>
    </div>

    <div class="ha-form-group">
      <label for="mes" class="ha-label">Mes:</label>
      <input type="month" id="mes" class="ha-input" readonly>
    </div>

    <hr>

    <div id="tablaResumen" class="ha-tabla-contenedor">
      <!-- header + empty tbody se inyecta desde JS -->
    </div>
  </div>
</div>