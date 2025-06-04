<div class="cu-wrapper">
  <form id="formularioCrearUsuario" class="cu-form">
    <h2 class="cu-titulo">Crear Usuario</h2>

    <!-- Filtros: Rol, Grado y Buscador -->
    <div class="cu-filtros">
      <label class="cu-label">
        Rol:
        <select id="rolUsuario" class="cu-select" required>
          <option value="">Seleccione</option>
          <option value="admin">Administrador</option>
          <option value="profesor">Profesor</option>
        </select>
      </label>

      <label id="gradoLabel" class="cu-label cu-oculto">
        Grado:
        <select id="gradoUsuario" class="cu-select">
          <option value="">Todos</option>
          <option value="1ro">1ro</option>
          <option value="2do">2do</option>
          <option value="3ro">3ro</option>
          <option value="4to">4to</option>
          <option value="5to">5to</option>
          <option value="6to">6to</option>
        </select>
      </label>

      <label class="cu-label cu-busqueda-wrapper">
        Buscar nombre:
        <input type="text" id="buscadorNombre" class="cu-input" placeholder="Escriba el nombre…" />
        <div id="sugerenciasNombres" class="cu-sugerencias"></div>
      </label>
    </div>

    <!-- Datos del nuevo usuario -->
    <div class="cu-form-group">
      <label for="inputNombre" class="cu-label">Nombre completo:</label>
      <input type="text" id="inputNombre" class="cu-input" required />
    </div>

    <div class="cu-form-group">
      <label for="inputPassword" class="cu-label">Contraseña:</label>
      <input type="password" id="inputPassword" class="cu-input" required />
    </div>

    <button type="submit" class="cu-btn">Registrar Usuario</button>

    <p id="mensaje" class="cu-mensaje"></p>
  </form>
</div>
