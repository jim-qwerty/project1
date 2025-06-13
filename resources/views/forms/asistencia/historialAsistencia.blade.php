
<!-- Token CSRF para protección contra CSRF -->
<meta name="csrf-token" content="{{ csrf_token() }}">
<div class="ha-wrapper">
  <div class="ha-form">
    <h2 class="ha-titulo">Resumen Mensual de Asistencia</h2>

    <div class="ha-form-group">
      <label for="grado" class="ha-label">Grado:</label>
      <select id="grado" class="ha-input" required>
        <option value="">--Selecciona grado--</option>
      </select>
    </div>

    <div class="ha-form-group">
      <label for="seccion" class="ha-label">Sección:</label>
      <select id="seccion" class="ha-input" required>
        <option value="">--Selecciona sección--</option>
      </select>
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
      <select id="mes" class="ha-input" required>
        <option value="">--Selecciona mes--</option>
      </select>
    </div>

    <hr>

    <div id="tablaResumen" class="ha-tabla-contenedor">
      <!-- header + empty tbody se inyecta desde JS -->
    </div>
  </div>
</div>
