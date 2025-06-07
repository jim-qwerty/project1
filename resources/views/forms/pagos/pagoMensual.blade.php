<div class="pm-wrapper">
  <form id="formularioPagos" class="pm-form">
    <h2 class="pm-titulo">Formulario de Pagos</h2>

    <div class="pm-filtros">
      <label class="pm-label">Grado:
        <select id="gradoSelect" class="pm-select" required>
          <option value="">Seleccione</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
          <option value="3">3°</option>
        </select>
      </label>

      <label class="pm-label">Sección:
        <select id="seccionSelect" class="pm-select" required>
          <option value="">Seleccione</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </label>

      <label class="pm-label">Mes:
        <select id="mesSelect" class="pm-select" required>
          <option value="01">Enero</option>
          <!-- …resto de meses… -->
          <option value="12">Diciembre</option>
        </select>
      </label>

      <label class="pm-label">Fecha:
        <!-- Ahora sin readonly: -->
        <input
          type="date"
          id="fechaSistema"
          class="pm-input"
          value="{{ now()->format('Y-m-d') }}"
          required
        >
      </label>
    </div>

    <div class="pm-campo-alumno">
      <label class="pm-label">Alumno:
        <input type="text" id="alumnoInput" class="pm-input" required autocomplete="off">
        <ul id="listaCoincidencias" class="pm-lista-coincidencias"></ul>
      </label>
    </div>

    <div>
      <label class="pm-label">Monto (S/.):
        <input type="number" id="montoPago" class="pm-input" required min="0" step="0.01">
      </label>
    </div>

    <div>
      <button type="submit" class="pm-btn">Registrar Pago</button>
    </div>

    <div id="mensajeConfirmacion" class="pm-mensaje"></div>
  </form>
</div>
