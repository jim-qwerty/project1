<div class="ra-wrapper">
  <form action="procesar_asistencia.php" method="post" class="ra-form">
    <div class="ra-fila-superior">
      <label>Fecha:
        <input type="date" name="fecha" id="fechaActual" readonly class="ra-input">
      </label>
      <label>Grado:
        <input type="text" name="grado" required class="ra-input">
      </label>
      <label>Sección:
        <input type="text" name="seccion" required class="ra-input">
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
        <!-- Aquí inyectaremos las filas desde JS -->
      </tbody>
    </table>

    <div class="ra-botones">
      <button type="submit" name="accion" value="editar" class="ra-btn">Editar Asistencia</button>
      <button type="submit" name="accion" value="registrar" class="ra-btn">Registrar Asistencia</button>
    </div>
  </form>
</div>
