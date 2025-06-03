<form id="formularioHistorial">
  <h2>Historial de Pagos</h2>

  <div class="filtros">
    <label for="gradoHistorial">Grado:</label>
    <select id="gradoHistorial" required>
      <option value="">Seleccione</option>
      <option value="1">1°</option>
      <option value="2">2°</option>
      <option value="3">3°</option>
    </select>

    <label for="seccionHistorial">Sección:</label>
    <select id="seccionHistorial" required>
      <option value="">Seleccione</option>
      <option value="A">A</option>
      <option value="B">B</option>
    </select>

    <label for="mesHistorial">Mes:</label>
    <select id="mesHistorial" required>
      <option value="">Seleccione</option>
      <option value="Enero">Enero</option>
      <option value="Febrero">Febrero</option>
      <option value="Marzo">Marzo</option>
      <option value="Abril">Abril</option>
      <option value="Mayo">Mayo</option>
      <option value="Junio">Junio</option>
      <option value="Julio">Julio</option>
      <option value="Agosto">Agosto</option>
      <option value="Septiembre">Septiembre</option>
      <option value="Octubre">Octubre</option>
      <option value="Noviembre">Noviembre</option>
      <option value="Diciembre">Diciembre</option>
    </select>

    <label for="buscadorAlumno">Buscar alumno:</label>
<div class="busqueda-wrapper">
  <input type="text" id="buscadorAlumno" placeholder="Escriba el nombre del alumno..." />
  <div id="sugerenciasAlumnos" class="sugerencias"></div>
</div>


<button type="button" id="btnDeudores">Mostrar solo deudores</button>

  </div>

  <table id="tablaPagos">
    <thead>
      <tr>
        <th>Alumno</th>
        <th>Mes</th>
        <th>Fecha</th>
        <th>Monto (S/.)</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</form>
