<meta name="csrf-token" content="{{ csrf_token() }}">


<div class="m-wrapper">
  <!-- FORMULARIO DE MATRÍCULA -->
  <form id="matricula-form" class="m-formulario">
    <h2 class="m-title">Formulario de Matrícula</h2>

    <div class="m-user-details">
      <div class="m-section-title">DATOS DEL ALUMNO</div>

      <div class="m-input-box">
        <span class="m-details">Nombres</span>
        <input type="text" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" placeholder="Ingrese nombres">
      </div>

      <div class="m-input-box">
        <span class="m-details">Apellidos</span>
        <input type="text" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" placeholder="Ingrese apellidos">
      </div>

      <div class="m-input-box">
        <span class="m-details">DNI</span>
        <input type="text" required pattern="\d{8}" maxlength="8" placeholder="Ingrese DNI">
      </div>

      <div class="m-input-box">
        <span class="m-details">Fecha de nacimiento</span>
        <input type="date" id="fecha-nacimiento" required>
      </div>

      <div class="m-input-box">
        <span class="m-details">Edad</span>
        <input type="text" id="edad" readonly placeholder="Edad">
      </div>

      <div class="m-input-box">
        <span class="m-details">Nivel educativo</span>
        <select id="nivel-educativo" required>
          <option value="">Seleccione</option>
          <option value="Inicial">Inicial</option>
          <option value="Primaria">Primaria</option>
        </select>
      </div>

      <div class="m-input-box">
        <span class="m-details">Grado</span>
        <select id="grado" required>
          <option value="">Seleccione grado</option>
        </select>
      </div>

      <!-- Nuevo bloque Sección -->
      <div class="m-input-box">
        <span class="m-details">Sección</span>
        <select id="seccion" required>
          <option value="">Seleccione sección</option>
        </select>
      </div>

      <div class="m-input-box">
        <span class="m-details">Dirección</span>
        <input type="text" required placeholder="Ingrese dirección">
      </div>

      <div class="m-input-box">
        <span class="m-details">Sexo</span>
        <div class="m-radio-group">
          <label><input type="radio" name="sexo" value="Masculino" required> Masculino</label>
          <label><input type="radio" name="sexo" value="Femenino"> Femenino</label>
        </div>
      </div>
    </div>

    <div class="m-user-details">
      <div class="m-section-title">DATOS DEL APODERADO</div>

      <div class="m-input-box">
        <span class="m-details">Nombres</span>
        <input type="text" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" placeholder="Ingrese nombres del apoderado">
      </div>

      <div class="m-input-box">
        <span class="m-details">Apellidos</span>
        <input type="text" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" placeholder="Ingrese apellidos del apoderado">
      </div>

      <div class="m-input-box">
        <span class="m-details">DNI</span>
        <input type="text" required pattern="\d{8}" maxlength="8" placeholder="Ingrese DNI del apoderado">
      </div>

      <div class="m-input-box">
        <span class="m-details">Parentesco</span>
        <input type="text" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" placeholder="Padre, Madre, Tutor, etc.">
      </div>

      <div class="m-input-box">
        <span class="m-details">Celular</span>
        <input type="text" required pattern="\d{9}" maxlength="9" placeholder="Ingrese celular">
      </div>

      <div class="m-input-box">
        <span class="m-details">Correo electrónico</span>
        <input type="email" required placeholder="Ingrese email">
      </div>
    </div>

    <div class="m-button">
      <input type="submit" value="Procesar Matrícula">
    </div>
  </form>

  <!-- FORMULARIO DE PAGO -->
  <form id="pago-form" class="m-formulario" style="display: none;">
    <h2 class="m-title">Pago de Matrícula</h2>

    <div class="m-user-details">
      <div class="m-section-title">DETALLES DEL PAGO</div>

      <div class="m-input-box">
        <span class="m-details">Alumno</span>
        <input type="text" id="resumen-nombre" readonly>
      </div>

      <div class="m-input-box">
        <span class="m-details">DNI</span>
        <input type="text" id="resumen-dni" readonly>
      </div>

      <div class="m-input-box">
        <span class="m-details">Monto a pagar (S/)</span>
        <input type="number" min="1" required placeholder="Ingrese monto">
      </div>

      <div class="m-input-box">
        <span class="m-details">Método de pago</span>
        <select required>
          <option value="">Seleccione</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta de crédito/débito</option>
          <option value="yape">Yape</option>
          <option value="plin">Plin</option>
        </select>
      </div>

      <div class="m-input-box">
        <span class="m-details">Fecha de pago</span>
        <input type="date" required>
      </div>

      <div class="m-input-box">
        <span class="m-details">Observación</span>
        <input type="text" placeholder="Detalles...">
      </div>
    </div>

    <div class="m-button-group">
      <button type="button" id="regresar-btn">← Regresar</button>
      <input type="submit" value="Confirmar Pago">
    </div>
  </form>

  <!-- CONFIRMACIÓN -->
  <div id="confirmacion" class="m-confirmacion" style="display: none;">
    <div>
      <p id="confirmacion-mensaje"></p>
      <div class="m-confirmacion-botones">
        <button id="btn-si">Sí</button>
        <button id="btn-no">No</button>
      </div>
    </div>
  </div>
</div>

<div id="mensaje" class="m-mensaje" style="display:none; color: green; margin-bottom: 1em;"></div>
