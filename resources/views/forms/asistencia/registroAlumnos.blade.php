<!-- Token CSRF para protección contra CSRF -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="ra-wrapper">
  <form action="procesar_asistencia.php" method="post" class="ra-form">
    <div class="ra-fila-superior">
      <label>Fecha:
        <!--<input type="date" name="fecha" id="fechaActual" readonly class="ra-input">-->
        <input type="date" name="fecha" id="fechaActual" class="ra-input" placeholder="AAAA-MM-DD">
      </label>

      <label>Grado:
        <select name="grado" id="gradoSelect" class="ra-input" required>
          <option value="">--Selecciona grado--</option>
        </select>
      </label>

      <label>Sección:
        <select name="seccion" id="seccionSelect" class="ra-input" required>
          <option value="">--Selecciona sección--</option>
        </select>
      </label>
    </div>

    <table class="ra-tabla">
      <thead>
        <tr>
          <th>N°</th>
          <th>Alumno</th>
          <th>Presente</th>
          <th>Tarde</th>
          <th>Falta</th>
        </tr>
      </thead>
      <tbody id="ra-tbody">
        <!-- Filas inyectadas por JS -->
      </tbody>
    </table>

    <div class="ra-botones">
      <button type="submit" name="accion" value="editar" class="ra-btn">Editar Asistencia</button>
      <button type="submit" name="accion" value="registrar" class="ra-btn">Registrar Asistencia</button>
    </div>
  </form>
</div>
