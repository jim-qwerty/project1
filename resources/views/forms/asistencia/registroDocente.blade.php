<div class="rd-wrapper">
  <form id="formRegistroDocente" class="rd-form">
    <h2 class="rd-titulo">Registro de Asistencia del Docente</h2>

    <div class="rd-form-group">
      <label for="nombre" class="rd-label">Nombre del Docente:</label>
      <input type="text" id="nombre" name="nombre" class="rd-input" required>
    </div>

    <div class="rd-form-group">
      <label for="grado" class="rd-label">Grado:</label>
      <select id="grado" name="grado" class="rd-select" required>
        <option value="">Selecciona un grado</option>
        <option value="1ro">1ro</option>
        <option value="2do">2do</option>
        <option value="3ro">3ro</option>
      </select>
    </div>

    <p class="rd-fecha-hora"><strong>Fecha:</strong> <span id="fechaActual"></span></p>
    <p class="rd-fecha-hora"><strong>Hora:</strong> <span id="horaActual"></span></p>

    <button type="submit" class="rd-btn">Registrar Asistencia</button>

    <p id="mensajeConfirmacion" class="rd-mensaje"></p>
  </form>
</div>
