<div class="hp-wrapper">
  <form id="formularioHistorial" class="hp-form">
    <h2 class="hp-titulo">Historial de Pagos</h2>

    <div class="hp-filtros">
      <label class="hp-label" for="gradoHistorial">Grado:
        <select id="gradoHistorial" class="hp-select" required>
          <option value="">Seleccione</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
          <option value="3">3°</option>
        </select>
      </label>

      <label class="hp-label" for="seccionHistorial">Sección:
        <select id="seccionHistorial" class="hp-select" required>
          <option value="">Seleccione</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </label>

      <label class="hp-label" for="mesHistorial">Mes:
        <select id="mesHistorial" class="hp-select" required>
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
      </label>

      <label class="hp-label" for="buscadorAlumno">Buscar alumno:</label>
      <div class="hp-busqueda-wrapper">
        <input type="text" id="buscadorAlumno" class="hp-input" placeholder="Escriba el nombre del alumno...">
        <div id="sugerenciasAlumnos" class="hp-sugerencias"></div>
      </div>

      <button type="button" id="btnDeudores" class="hp-btn-deudores">Mostrar solo deudores</button>
    </div>

    <table id="tablaPagos" class="hp-tabla">
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
</div>
