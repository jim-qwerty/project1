{{-- resources/views/forms/gestionUsuarios/crearUsuarios.blade.php --}}
<div class="cu-wrapper">
  <form id="formularioCrearUsuario" class="cu-form" autocomplete="off">
    <h2 class="cu-titulo">Crear Usuario</h2>

    <!-- ────────── FILTROS: Rol / Buscador ────────── -->
    <div class="cu-filtros">
      <label class="cu-label">
        Rol:
        <select id="rolUsuario" class="cu-select" required>
          <option value="">Seleccione</option>
          <option value="admin">Administrador</option>
          <option value="profesor">Profesor</option>
        </select>
      </label>

      <label class="cu-label cu-busqueda-wrapper">
        Buscar nombre:
        <input
          type="text"
          id="buscadorNombre"
          class="cu-input"
          placeholder="Escriba el nombre…"
          autocomplete="off"
        />
        <div id="sugerenciasNombres" class="cu-sugerencias"></div>
      </label>
    </div>

    <!-- ────────── DATOS DEL USUARIO ────────── -->
    <div class="cu-form-group">
      <label for="inputNombres" class="cu-label">Nombres:</label>
      <input type="text" id="inputNombres" class="cu-input" required />
    </div>

    <div class="cu-form-group">
      <label for="inputApellidos" class="cu-label">Apellidos:</label>
      <input type="text" id="inputApellidos" class="cu-input" required />
    </div>

    <div class="cu-form-group">
      <label for="inputUsuario" class="cu-label">Usuario:</label>
      <input type="text" id="inputUsuario" class="cu-input" required />
    </div>

    <div class="cu-form-group">
      <label for="inputPassword" class="cu-label">Contraseña:</label>
      <input type="password" id="inputPassword" class="cu-input" required />
    </div>

    <button type="submit" class="cu-btn">Registrar Usuario</button>
    <p id="mensaje" class="cu-mensaje"></p>
  </form>
</div>
