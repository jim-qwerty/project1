{{-- CSRF token para Axios --}}
<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="pm-wrapper">
  <form id="formularioPagos" class="pm-form">
    <h2 class="pm-titulo">Formulario de Pagos</h2>

    <div class="pm-filtros">
      <label class="pm-label">Grado:
        <select id="gradoSelect" class="pm-select" required>
          <option value="">Seleccione grado</option>
          {{-- Opciones cargadas por JS --}}
        </select>
      </label>

      <label class="pm-label">Sección:
        <select id="seccionSelect" class="pm-select" required>
          <option value="">Seleccione sección</option>
          {{-- Opciones cargadas por JS --}}
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
      <input type="hidden" id="alumnoId" name="alumno_id">
      <ul id="listaCoincidencias" class="pm-lista-coincidencias"></ul>
    </label>
    </div>

    <div class="pm-monto">
      <label class="pm-label">Monto (S/.):
        <input type="number" id="montoPago" class="pm-input" required min="0" step="0.01">
      </label>
    </div>

    {{-- Nuevo selector de método de pago --}}
    <div class="pm-metodo">
      <label class="pm-label">Método de pago:
        <select id="metodoPago" class="pm-select" required>
          <option value="">Seleccione</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta de crédito/débito</option>
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
        </select>
      </label>
    </div>

    {{-- Nuevo campo de observaciones --}}
    <div class="pm-observaciones">
      <label class="pm-label">Observaciones:
        <input
          type="text"
          id="observaciones"
          class="pm-input"
          placeholder="Escribe alguna observación (opcional)"
        >
      </label>
    </div>

    <div class="pm-acciones">
      <button type="submit" class="pm-btn">Registrar Pago</button>
    </div>

    <div id="mensajeConfirmacion" class="pm-mensaje"></div>
  </form>
</div>


