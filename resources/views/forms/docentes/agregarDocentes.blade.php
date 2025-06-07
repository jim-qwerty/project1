<meta name="csrf-token" content="{{ csrf_token() }}">

<div id="agregar-profesores" class="ap-wrapper">
  <form id="formulario-profesor"
        class="ap-formulario"
        action="{{ route('docentes.store') }}"
        method="POST">
    @csrf

    <h2 class="ap-title">Formulario de Registro de Profesor</h2>

    <div class="ap-user-details">
      <div class="ap-section-title">DATOS DEL PROFESOR</div>

      <div class="ap-input-box">
        <span class="ap-details">Nombres</span>
        <input type="text"
               name="nombres"
               required
               placeholder="Ingrese nombres"
               pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
               title="Solo letras">
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Apellidos</span>
        <input type="text"
               name="apellidos"
               required
               placeholder="Ingrese apellidos"
               pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
               title="Solo letras">
      </div>

      <div class="ap-input-box">
        <span class="ap-details">DNI</span>
        <input type="text"
               name="dni"
               required
               placeholder="Ingrese DNI"
               pattern="\d{8}"
               maxlength="8"
               title="Debe contener 8 dígitos numéricos">
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Fecha de nacimiento</span>
        <input type="date"
               id="fechaNacimiento"
               name="fecha_nacimiento"
               required />
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Edad</span>
        <input type="text"
               id="edad"
               name="edad"
               readonly />
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Grado asignado</span>
        <select name="grado_asignado_id" required>
          <option value="">Seleccione un grado</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
          <option value="3">3°</option>
          <option value="4">4°</option>
          <option value="5">5°</option>
          <option value="6">6°</option>
        </select>
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Sección asignada</span>
        <select name="seccion_asignada_id" required>
          <option value="">Seleccione una sección</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Correo</span>
        <input type="email"
               name="correo_electronico"
               required
               placeholder="ejemplo@correo.com">
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Celular</span>
        <input type="text"
               name="celular"
               required
               placeholder="Ingrese número"
               pattern="\d{9}"
               maxlength="9"
               title="Debe contener 9 dígitos numéricos">
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Dirección</span>
        <input type="text"
               name="direccion"
               required
               placeholder="Ingrese dirección">
      </div>

      <div class="ap-input-box">
        <span class="ap-details">Sexo</span>
        <div class="ap-radio-group">
          <label>
            <input type="radio"
                   name="sexo"
                   value="M"
                   required>
            Masculino
          </label>
          <label>
            <input type="radio"
                   name="sexo"
                   value="F">
            Femenino
          </label>
        </div>
      </div>
    </div>

    <div class="ap-button">
      <input type="submit" value="Registrar Profesor">
    </div>
  </form>

  <div id="mensaje"></div>
</div>
