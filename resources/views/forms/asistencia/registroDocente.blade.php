<!-- Token CSRF para protección contra CSRF -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="rd-wrapper">
  <form id="formRegistroDocente" class="rd-form">
    <h2 class="rd-titulo">Registro de Asistencia del Docente</h2>

    <div class="rd-form-group rd-autocomplete">
      <label for="nombre" class="rd-label">Nombre del Docente:</label>
      <input 
        type="text" 
        id="nombre" 
        name="nombre" 
        class="rd-input" 
        autocomplete="off" 
        placeholder="Escribe apellidos y nombres" 
        required 
      >
      <ul id="suggestions" class="rd-suggestions"></ul>
    </div>

    <div class="rd-form-group">
      <label for="grado" class="rd-label">Grado:</label>
      <input 
        type="text" 
        id="grado" 
        name="grado" 
        class="rd-input" 
        readonly 
        placeholder="Se rellenará automáticamente" 
        required 
      >
    </div>

    <div class="rd-form-group">
      <label for="seccion" class="rd-label">Sección:</label>
      <input 
        type="text" 
        id="seccion" 
        name="seccion" 
        class="rd-input" 
        readonly 
        placeholder="Se rellenará automáticamente" 
        required 
      >
    </div>

    <p class="rd-fecha-hora"><strong>Fecha:</strong> <span id="fechaActual"></span></p>
    <p class="rd-fecha-hora"><strong>Hora:</strong> <span id="horaActual"></span></p>

    <button type="submit" class="rd-btn">Registrar Asistencia</button>

    <p id="mensajeConfirmacion" class="rd-mensaje"></p>
  </form>
</div>
