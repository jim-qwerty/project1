{{-- resources/views/docentes/listaDocentes.blade.php --}}
<div id="lista-profesores" class="lp-wrapper">
  <form id="formListaProfesores">
    <div class="lp-filtros">
      <label for="gradoFiltro">Grado:</label>
      <select id="gradoFiltro" name="gradoFiltro">
        <option value="">Todos</option>
        <option value="1ro">1ro</option>
        <option value="2do">2do</option>
        <option value="3ro">3ro</option>
      </select>

      <input type="text"
             id="buscador"
             name="buscador"
             placeholder="Buscar por nombre o apellido">
    </div>

    <table id="tablaProfesores" class="lp-tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Grado</th>
          <th>Sección</th>
          <th>Correo</th>        {{-- Nueva columna --}}
          <th>Celular</th>       {{-- Nueva columna --}}
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody id="cuerpoTabla">
        <!-- Las filas se generan con JavaScript -->
      </tbody>
    </table>
  </form>
</div>
