
    {{-- CSRF token necesario para Axios --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <div class="pago-wrapper">
      <form id="pago-form" class="pago-formulario">
        <h2 class="pago-title">Pago de Matrícula</h2>

        <div class="pago-user-details">
          <div class="pago-section-title">DETALLES DEL PAGO</div>

          <div class="pago-input-box">
            <span class="pago-details">Alumno</span>
            <input type="text" id="resumen-nombre" readonly>
          </div>

          <div class="pago-input-box">
            <span class="pago-details">DNI</span>
            <input type="text" id="resumen-dni" readonly>
          </div>

          <div class="pago-input-box">
            <span class="pago-details">Monto a pagar (S/)</span>
            <input type="number" min="1" required placeholder="Ingrese monto">
          </div>

          <div class="pago-input-box">
            <span class="pago-details">Método de pago</span>
            <select required>
              <option value="">Seleccione</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta de crédito/débito</option>
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
            </select>
          </div>

          <div class="pago-input-box">
            <span class="pago-details">Fecha de pago</span>
            <input type="date" required>
          </div>

          <div class="pago-input-box">
            <span class="pago-details">Observación</span>
            <input type="text" placeholder="Detalles...">
          </div>
        </div>

        <div class="pago-button-group">
          <button type="button" id="regresar-btn">← Regresar</button>
          <input type="submit" value="Confirmar Pago">
        </div>
      </form>

      {{-- Contenedor para mensajes breves --}}
      <div id="mensaje" class="pago-mensaje" style="display:none; color:green; margin-top:1em;"></div>

      {{-- Modal de confirmación --}}
      <div id="confirmacion" class="pago-confirmacion" style="display:none;">
        <div>
          <p id="confirmacion-mensaje"></p>
          <div class="pago-confirmacion-botones" style="display:flex; gap:1em; justify-content:center; margin-top:1em;">
            <button id="btn-si">Sí</button>
            <button id="btn-no">No</button>
          </div>
        </div>
      </div>
    </div>

