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
          <th colspan="3">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Luis Contreras</td>
          <td><label><input type="radio" name="estado[1]" value="Puntual" required> Puntual</label></td>
          <td><label><input type="radio" name="estado[1]" value="Tarde"> Tarde</label></td>
          <td><label><input type="radio" name="estado[1]" value="Falta"> Falta</label></td>
          <input type="hidden" name="alumno[1]" value="Luis Contreras">
        </tr>
        <tr>
          <td>2</td>
          <td>Pedro Ruiz</td>
          <td><label><input type="radio" name="estado[2]" value="Puntual" required> Puntual</label></td>
          <td><label><input type="radio" name="estado[2]" value="Tarde"> Tarde</label></td>
          <td><label><input type="radio" name="estado[2]" value="Falta"> Falta</label></td>
          <input type="hidden" name="alumno[2]" value="Pedro Ruiz">
        </tr>
      </tbody>
    </table>

    <div class="ra-botones">
      <button type="submit" name="accion" value="editar" class="ra-btn">Editar Asistencia</button>
      <button type="submit" name="accion" value="registrar" class="ra-btn">Registrar Asistencia</button>
    </div>
  </form>
</div>
