<div id="agregar-profesores">
<form id="formulario-profesor" class="formulario">
  <h2 class="title">Formulario de Registro de Profesor</h2>

  <div class="user-details">
    <div class="section-title">DATOS DEL PROFESOR</div>

    <div class="input-box">
      <span class="details">Nombres</span>
      <input type="text" placeholder="Ingrese nombres" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" title="Solo letras">
    </div>

    <div class="input-box">
      <span class="details">Apellidos</span>
      <input type="text" placeholder="Ingrese apellidos" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" title="Solo letras">
    </div>

    <div class="input-box">
      <span class="details">DNI</span>
      <input type="text" placeholder="Ingrese DNI" required pattern="\d{8}" maxlength="8" title="Debe contener 8 dígitos numéricos">
    </div>

    <div class="input-box">
      <span class="details">Fecha de nacimiento</span>
      <input type="date" id="fechaNacimiento" name="fechaNacimiento" required />
    </div>

    <div class="input-box">
      <span class="details">Edad</span>
      <input type="text" id="edad" name="edad" readonly />
    </div>

    <div class="input-box">
      <span class="details">Grado asignado</span>
      <select required>
        <option value="">Seleccione un grado</option>
        <option value="1°">1°</option>
        <option value="2°">2°</option>
        <option value="3°">3°</option>
        <option value="4°">4°</option>
        <option value="5°">5°</option>
        <option value="6°">6°</option>
      </select>
    </div>

    <div class="input-box">
      <span class="details">Sección asignada</span>
      <select required>
        <option value="">Seleccione una sección</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
    </div>

    <div class="input-box">
      <span class="details">Correo</span>
      <input type="email" placeholder="ejemplo@correo.com" required>
    </div>

    <div class="input-box">
      <span class="details">Celular</span>
      <input type="text" placeholder="Ingrese número" required pattern="\d{9}" maxlength="9" title="Debe contener 9 dígitos numéricos">
    </div>

    <div class="input-box">
      <span class="details">Dirección</span>
      <input type="text" placeholder="Ingrese dirección" required>
    </div>

    <div class="input-box">
      <span class="details">Sexo</span>
      <div class="radio-group">
        <label><input type="radio" name="sexo" value="Masculino" required> Masculino</label>
        <label><input type="radio" name="sexo" value="Femenino"> Femenino</label>
      </div>
    </div>
  </div>

  <div class="button">
    <input type="submit" value="Registrar Profesor">
  </div>
</form>
<div id="mensaje"></div> <!-- Agrega este div para mostrar mensajes -->
</div>