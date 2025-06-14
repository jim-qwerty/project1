<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="m-wrapper">
  <!-- FORMULARIO DE MATRÍCULA -->
  <form id="matricula-form" class="m-formulario">
    <h2 class="m-title">Formulario de Matrícula</h2>

    <div class="m-user-details">
      <div class="m-section-title">DATOS DEL ALUMNO</div>

      <div class="m-input-box">
        <span class="m-details">Nombres</span>
        <input
          type="text"
          id="nombres"
          name="nombres"
          required
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
          placeholder="Ingrese nombres"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Apellidos</span>
        <input
          type="text"
          id="apellidos"
          name="apellidos"
          required
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
          placeholder="Ingrese apellidos"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">DNI</span>
        <input
          type="text"
          id="dni"
          name="dni"
          required
          pattern="\d{8}"
          maxlength="8"
          placeholder="Ingrese DNI"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Fecha de nacimiento</span>
        <input
          type="date"
          id="fecha-nacimiento"
          name="fecha_nacimiento"
          required
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Edad</span>
        <input
          type="text"
          id="edad"
          name="edad"
          readonly
          placeholder="Edad"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Nivel educativo</span>
        <select
          id="nivel-educativo"
          name="nivel_educativo"
          required
        >
          <option value="">Seleccione</option>
          <option value="Inicial">Inicial</option>
          <option value="Primaria">Primaria</option>
        </select>
      </div>

      <div class="m-input-box">
        <span class="m-details">Grado</span>
        <select
          id="grado"
          name="grado_id"
          required
        >
          <option value="">Seleccione grado</option>
        </select>
      </div>

      <div class="m-input-box">
        <span class="m-details">Sección</span>
        <select
          id="seccion"
          name="seccion_id"
          required
        >
          <option value="">Seleccione sección</option>
        </select>
      </div>

      <div class="m-input-box">
        <span class="m-details">Dirección</span>
        <input
          type="text"
          id="direccion"
          name="direccion"
          required
          placeholder="Ingrese dirección"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Sexo</span>
        <div class="m-radio-group">
          <label>
            <input
              type="radio"
              name="sexo"
              value="Masculino"
              required
            > Masculino
          </label>
          <label>
            <input
              type="radio"
              name="sexo"
              value="Femenino"
            > Femenino
          </label>
        </div>
      </div>
    </div>

    <div class="m-user-details">
      <div class="m-section-title">DATOS DEL APODERADO</div>

      <div class="m-input-box">
        <span class="m-details">Nombres</span>
        <input
          type="text"
          id="apoderado_nombres"
          name="apoderado_nombres"
          required
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
          placeholder="Ingrese nombres del apoderado"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Apellidos</span>
        <input
          type="text"
          id="apoderado_apellidos"
          name="apoderado_apellidos"
          required
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
          placeholder="Ingrese apellidos del apoderado"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">DNI</span>
        <input
          type="text"
          id="apoderado_dni"
          name="apoderado_dni"
          required
          pattern="\d{8}"
          maxlength="8"
          placeholder="Ingrese DNI del apoderado"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Parentesco</span>
        <input
          type="text"
          id="parentesco"
          name="parentesco"
          required
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
          placeholder="Padre, Madre, Tutor, etc."
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Celular</span>
        <input
          type="text"
          id="celular"
          name="celular"
          required
          pattern="\d{9}"
          maxlength="9"
          placeholder="Ingrese celular"
        >
      </div>

      <div class="m-input-box">
        <span class="m-details">Correo electrónico</span>
        <input
          type="email"
          id="correo_electronico"
          name="correo_electronico"
          required
          placeholder="Ingrese email"
        >
      </div>
    </div>

    <div class="m-button">
      <input type="submit" value="Procesar Matrícula">
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

  <div id="mensaje" class="m-mensaje"
       style="display:none; color: green; margin-bottom: 1em;"></div>
</div>
