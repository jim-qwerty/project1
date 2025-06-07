// resources/js/forms/pagos/historialPagos.js
import '/resources/css/forms/pagos/historialPagos.css';

export default function initHistorialPagos(container = document.querySelector('.hp-wrapper')) {
  if (!container) return;

  const historialData    = [
    { grado: "1", seccion: "A", alumno: "Pedro Garcia",   mes: "Enero",   fecha: "2024-01-15", monto: 50 },
    { grado: "1", seccion: "A", alumno: "Pedro Perez",    mes: "Enero",   fecha: "2024-01-20", monto: 50 },
    { grado: "1", seccion: "B", alumno: "Luis Fernandez", mes: "Febrero", fecha: "2024-02-10", monto: 50 },
    { grado: "2", seccion: "A", alumno: "Carlos Ruiz",    mes: "Enero",   fecha: "2024-01-17", monto: 50 },
    { grado: "3", seccion: "B", alumno: "Sofia Mendoza",  mes: "Marzo",   fecha: "2024-03-05", monto: 50 }
  ];

  const alumnosData = [
    { grado: "1", seccion: "A", alumno: "Pedro Garcia" },
    { grado: "1", seccion: "A", alumno: "Pedro Perez" },
    { grado: "1", seccion: "A", alumno: "Maria Torres" },
    { grado: "1", seccion: "B", alumno: "Luis Fernandez" },
    { grado: "2", seccion: "A", alumno: "Carlos Ruiz" },
    { grado: "3", seccion: "B", alumno: "Sofia Mendoza" }
  ];

  const gradoSelect      = container.querySelector('#gradoHistorial');
  const seccionSelect    = container.querySelector('#seccionHistorial');
  const mesSelect        = container.querySelector('#mesHistorial');
  const buscadorInput    = container.querySelector('#buscadorAlumno');
  const sugerenciasDiv   = container.querySelector('#sugerenciasAlumnos');
  const tablaBody        = container.querySelector('#tablaPagos tbody');
  const btnDeudores      = container.querySelector('#btnDeudores');

  let resultadosFiltrados = [];

  // pinta una fila de "No hay pagos..." o los pagos
  function mostrarResultados(lista) {
    tablaBody.innerHTML = '';
    if (lista.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4;
      td.textContent = 'No hay pagos registrados para esta combinación.';
      tr.appendChild(td);
      tablaBody.appendChild(tr);
      return;
    }
    lista.forEach(pago => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pago.alumno}</td>
        <td>${pago.mes}</td>
        <td>${pago.fecha}</td>
        <td>${pago.monto.toFixed(2)}</td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // actualiza resultadosFiltrados tras cambiar filtros y pinta tabla inicial
  function actualizarTabla() {
    const grado   = gradoSelect.value;
    const seccion = seccionSelect.value;
    const mes     = mesSelect.value;

    if (!grado || !seccion || !mes) {
      resultadosFiltrados = [];
      mostrarResultados([]);
      return;
    }

    const alumnosFiltrados = alumnosData.filter(a =>
      a.grado === grado && a.seccion === seccion
    );
    const pagosDelMes = historialData.filter(h =>
      h.grado === grado && h.seccion === seccion && h.mes === mes
    );

    resultadosFiltrados = alumnosFiltrados.map(a => {
      const pago = pagosDelMes.find(p => p.alumno === a.alumno);
      return {
        alumno: a.alumno,
        mes,
        fecha: pago ? pago.fecha : '',
        monto: pago ? pago.monto : 0
      };
    });

    // al iniciar tras filtros, pintamos TODO el listado
    mostrarResultados(resultadosFiltrados);
  }

  // al click en "Mostrar deudores"
  function mostrarDeudores() {
    mostrarResultados(resultadosFiltrados.filter(r => r.monto === 0));
  }

  // muestra sólo las sugerencias sin tocar la tabla
  function actualizarSugerencias() {
    const term = buscadorInput.value.trim().toLowerCase();
    sugerenciasDiv.innerHTML = '';
    if (!term) return;

    // obtengo nombres únicos que coinciden en resultadosFiltrados
    const nombres = [...new Set(
      resultadosFiltrados
        .filter(r => r.alumno.toLowerCase().includes(term))
        .map(r => r.alumno)
    )];

    nombres.forEach(nombre => {
      const div = document.createElement('div');
      div.textContent = nombre;
      div.classList.add('hp-sugerencia-item');
      div.addEventListener('click', () => {
        // al seleccionar, pinto sólo esa fila en la tabla
        buscadorInput.value = nombre;
        sugerenciasDiv.innerHTML = '';
        mostrarResultados(
          resultadosFiltrados.filter(r =>
            r.alumno.toLowerCase() === nombre.toLowerCase()
          )
        );
      });
      sugerenciasDiv.appendChild(div);
    });
  }

  // listeners
  gradoSelect  .addEventListener('change', actualizarTabla);
  seccionSelect.addEventListener('change', actualizarTabla);
  mesSelect    .addEventListener('change', actualizarTabla);
  btnDeudores  .addEventListener('click', mostrarDeudores);

  buscadorInput
    .addEventListener('input', actualizarSugerencias);

  buscadorInput
    .addEventListener('blur', () => {
      // cierra sugerencias tras perder foco
      setTimeout(() => sugerenciasDiv.innerHTML = '', 150);
    });

  // tabla visible desde el inicio (sólo header + "No hay pagos…")
  mostrarResultados([]);
}

document.addEventListener('DOMContentLoaded', () => initHistorialPagos());
