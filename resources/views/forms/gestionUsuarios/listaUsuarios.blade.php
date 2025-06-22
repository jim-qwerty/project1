{{-- resources/views/usuarios/listaUsuarios.blade.php --}}
<div class="lu-wrapper">
  <meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="rol-usuario" content="{{ auth()->user()->rol }}">
  <form id="formUsuarios" class="lu-form">
    <h2 class="lu-titulo">Lista de Usuarios</h2>

    <div class="lu-filtros">
      <label for="selectRol" class="lu-label">
        Rol:
        <select id="selectRol" name="rol" class="lu-select">
          <option value="">Todos</option>
          <option value="admin">Administrador</option>
          <option value="profesor">Profesor</option>
        </select>
      </label>

      <label class="lu-label lu-busqueda-wrapper">
        Buscar por nombre:
        <input
          type="text"
          id="buscador"
          class="lu-input"
          placeholder="Escriba el nombre…"
          autocomplete="off"
        />
        <div id="sugerenciasNombres" class="lu-sugerencias"></div>
      </label>
    </div>

    <table id="tablaUsuarios" class="lu-tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Rol</th>
          <th>Contraseña</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </form>
</div>
<!-- Mensaje de confirmación -->
<div id="confirmacion" class="m-confirmacion" style="display: none;">
  <div class="m-confirmacion-contenido">
    <p id="confirmacion-mensaje">¿Deseas actualizar la contraseña?</p>
    <div class="m-confirmacion-botones">
      <button id="btn-si">Sí</button>
      <button id="btn-no">No</button>
    </div>
  </div>
</div>

<!-- Mensaje de éxito -->
<div id="mensaje" class="m-mensaje" style="display: none;">Contraseña actualizada correctamente.</div>
