<div class="ha-wrapper">
  <form id="formResumenMensual" class="ha-form">
    <h2 class="ha-titulo">Resumen Mensual de Asistencia</h2>

    <div class="ha-form-group">
      <label for="grado" class="ha-label">Grado:</label>
      <select id="grado" class="ha-select">
        <option value="">-- Todos --</option>
        <option value="1">1°</option>
        <option value="2">2°</option>
        <option value="3">3°</option>
      </select>
    </div>

    <div class="ha-form-group">
      <label for="nombreAlumno" class="ha-label">Nombre del alumno:</label>
      <input type="text" id="nombreAlumno" class="ha-input" placeholder="Buscar por nombre">
    </div>

    <div class="ha-form-group">
      <label for="mes" class="ha-label">Mes:</label>
      <input type="month" id="mes" class="ha-input">
    </div>

    <button type="submit" class="ha-btn">Buscar</button>

    <hr>

    <div id="tablaResumen" class="ha-tabla-contenedor">
      <!-- Aquí se mostrará la tabla de asistencia -->
    </div>
  </form>
</div>
