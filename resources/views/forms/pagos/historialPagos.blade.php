{{-- resources/views/forms/pagos/historialPagos.blade.php --}}

{{-- CSRF token (por si en tu JS usas Axios para más peticiones) --}}
<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="hp-wrapper">
  <form id="formularioHistorial" class="hp-form">
    <h2 class="hp-titulo">Historial de Pagos</h2>

    <div class="hp-filtros">
      <label class="hp-label" for="gradoHistorial">Grado:
        <select id="gradoHistorial" class="hp-select" required>
          <option value="">Seleccione grado</option>
          {{-- Opciones cargadas desde JS --}}
        </select>
      </label>

      <label class="hp-label" for="seccionHistorial">Sección:
        <select id="seccionHistorial" class="hp-select" required>
          <option value="">Seleccione sección</option>
          {{-- Opciones cargadas desde JS --}}
        </select>
      </label>

      <label class="hp-label" for="mesHistorial">Mes:
        <select id="mesHistorial" class="hp-select" required>
          <option value="">Seleccione mes</option>
          {{-- Opciones cargadas desde JS --}}
        </select>
      </label>

      <label class="hp-label" for="buscadorAlumno">Buscar alumno:</label>
      <div class="hp-busqueda-wrapper">
        <input
          type="text"
          id="buscadorAlumno"
          class="hp-input"
          placeholder="Escriba el nombre del alumno..."
        >
        <div id="sugerenciasAlumnos" class="hp-sugerencias"></div>
      </div>

      <button type="button" id="btnDeudores" class="hp-btn-deudores">
        Mostrar solo deudores
      </button>
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


