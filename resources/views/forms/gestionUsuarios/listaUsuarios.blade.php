<div class="lu-wrapper">
  <form id="formUsuarios" class="lu-form">
    <h2 class="lu-titulo">Lista de Usuarios</h2>

    <div class="lu-filtros">
      <label for="selectRol" class="lu-label">Rol:</label>
      <select id="selectRol" name="rol" class="lu-select">
        <option value="">Todos</option>
        <option value="admin">Administrador</option>
        <option value="profesor">Profesor</option>
      </select>

      <input type="text" id="buscador" class="lu-input" placeholder="Buscar por nombre..." />
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
