<div class="lm-wrapper">
  <form id="form-alumnos" class="lm-form">
    <h2 class="lm-titulo">Lista de Matrículas</h2>

    <div class="lm-filters">
      <input type="text" id="buscador" class="lm-input" placeholder="Buscar por nombre o apellido">
      <select id="filtro-grado" class="lm-select">
        <option value="">Todos los grados</option>
        <option value="Primero">Primero</option>
        <option value="Segundo">Segundo</option>
        <option value="Tercero">Tercero</option>
      </select>
    </div>

    <table id="tabla-alumnos" class="lm-tabla">
      <thead>
        <tr>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Grado</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Juan</td>
          <td>Pérez</td>
          <td>Primero</td>
          <td>
            <select class="lm-estado-select">
              <option value="Matriculado" selected>Matriculado</option>
              <option value="En proceso">En proceso</option>
              <option value="Retirado">Retirado</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>María</td>
          <td>García</td>
          <td>Segundo</td>
          <td>
            <select class="lm-estado-select">
              <option value="Matriculado">Matriculado</option>
              <option value="En proceso" selected>En proceso</option>
              <option value="Retirado">Retirado</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Carlos</td>
          <td>Ramírez</td>
          <td>Primero</td>
          <td>
            <select class="lm-estado-select">
              <option value="Matriculado">Matriculado</option>
              <option value="En proceso">En proceso</option>
              <option value="Retirado" selected>Retirado</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <button id="guardar-btn" type="button" class="lm-btn">Guardar Cambios</button>

    <div id="mensaje-confirmacion" class="lm-confirmacion">Cambios guardados correctamente.</div>
  </form>
</div>
