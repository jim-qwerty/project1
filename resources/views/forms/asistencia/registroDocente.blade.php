<div class="rd-wrapper">
  <form id="formRegistroDocente" class="rd-form">
    <h2 class="rd-titulo">Registro de Asistencia del Docente</h2>

    <div class="rd-form-group">
      <label for="nombre" class="rd-label">Nombre del Docente:</label>
      <input type="text" id="nombre" name="nombre" class="rd-input" required>
    </div>

    <!-- GRADO ahora es un input de texto -->
    <div class="rd-form-group">
      <label for="grado" class="rd-label">Grado:</label>
      <input type="text" id="grado" name="grado" class="rd-input" placeholder="Ej. 1ro" required>
    </div>

    <!-- SECCIÓN agregado como input de texto -->
    <div class="rd-form-group">
      <label for="seccion" class="rd-label">Sección:</label>
      <input type="text" id="seccion" name="seccion" class="rd-input" placeholder="Ej. A" required>
    </div>

    <p class="rd-fecha-hora"><strong>Fecha:</strong> <span id="fechaActual"></span></p>
    <p class="rd-fecha-hora"><strong>Hora:</strong> <span id="horaActual"></span></p>

    <button type="submit" class="rd-btn">Registrar Asistencia</button>

    <p id="mensajeConfirmacion" class="rd-mensaje"></p>
  </form>
</div>
