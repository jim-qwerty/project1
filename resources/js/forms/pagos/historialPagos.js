import '/resources/css/forms/pagos/historialPagos.css'; // Asegúrate de que Vite lo procese

export default function initHistorialPagos(container = document.querySelector('historial-pagos')) {
  if (!container) return;

  const historialData = [
    { grado: "1", seccion: "A", alumno: "Pedro Garcia", mes: "Enero", fecha: "2024-01-15", monto: 50 },
    { grado: "1", seccion: "A", alumno: "Pedro Perez", mes: "Enero", fecha: "2024-01-20", monto: 50 },
    { grado: "1", seccion: "B", alumno: "Luis Fernandez", mes: "Febrero", fecha: "2024-02-10", monto: 50 },
    { grado: "2", seccion: "A", alumno: "Carlos Ruiz", mes: "Enero", fecha: "2024-01-17", monto: 50 },
    { grado: "3", seccion: "B", alumno: "Sofia Mendoza", mes: "Marzo", fecha: "2024-03-05", monto: 50 }
  ];

  const alumnosData = [
    { grado: "1", seccion: "A", alumno: "Pedro Garcia" },
    { grado: "1", seccion: "A", alumno: "Pedro Perez" },
    { grado: "1", seccion: "A", alumno: "Maria Torres" },
    { grado: "1", seccion: "B", alumno: "Luis Fernandez" },
    { grado: "2", seccion: "A", alumno: "Carlos Ruiz" },
    { grado: "3", seccion: "B", alumno: "Sofia Mendoza" }
  ];

  const gradoSelect = container.querySelector('#gradoHistorial');
  const seccionSelect = container.querySelector('#seccionHistorial');
  const mesSelect = container.querySelector('#mesHistorial');
  const buscadorInput = container.querySelector('#buscadorAlumno');
  const sugerenciasDiv = container.querySelector('#sugerenciasAlumnos');
  const tablaBody = container.querySelector('#tablaPagos tbody');
  const btnDeudores = container.querySelector('#btnDeudores');

  let resultadosFiltrados = [];

  const actualizarTabla = () => {
    const grado = gradoSelect.value;
    const seccion = seccionSelect.value;
    const mes = mesSelect.value;

    if (!grado || !seccion || !mes) return;

    const alumnosFiltrados = alumnosData.filter(
      a => a.grado === grado && a.seccion === seccion
    );

    const pagosDelMes = historialData.filter(
      h => h.grado === grado && h.seccion === seccion && h.mes === mes
    );

    const resultados = alumnosFiltrados.map(alumno => {
      const pago = pagosDelMes.find(p => p.alumno === alumno.alumno);
      return {
        alumno: alumno.alumno,
        mes: mes,
        fecha: pago ? pago.fecha : '',
        monto: pago ? pago.monto : 0
      };
    });

    resultadosFiltrados = resultados;
    mostrarResultados(resultados);
  };

  const mostrarResultados = (lista) => {
    tablaBody.innerHTML = '';

    if (lista.length === 0) {
      const fila = document.createElement('tr');
      const celda = document.createElement('td');
      celda.colSpan = 4;
      celda.textContent = 'No hay pagos registrados para esta combinación.';
      fila.appendChild(celda);
      tablaBody.appendChild(fila);
      return;
    }

    lista.forEach(pago => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${pago.alumno}</td>
        <td>${pago.mes}</td>
        <td>${pago.fecha}</td>
        <td>${pago.monto.toFixed(2)}</td>
      `;
      tablaBody.appendChild(fila);
    });
  };

  const mostrarDeudores = () => {
    const grado = gradoSelect.value;
    const seccion = seccionSelect.value;
    const mes = mesSelect.value;

    if (!grado || !seccion || !mes) return;

    const alumnosFiltrados = alumnosData.filter(
      a => a.grado === grado && a.seccion === seccion
    );

    const pagosDelMes = historialData.filter(
      h => h.grado === grado && h.seccion === seccion && h.mes === mes
    );

    const nombresQuePagaron = pagosDelMes.map(p => p.alumno);

    const deudores = alumnosFiltrados
      .filter(a => !nombresQuePagaron.includes(a.alumno))
      .map(a => ({
        alumno: a.alumno,
        mes: mes,
        fecha: '',
        monto: 0
      }));

    mostrarResultados(deudores);
  };

  const filtrarPorAlumno = () => {
    const texto = buscadorInput.value.trim().toLowerCase();
    sugerenciasDiv.innerHTML = '';

    if (!texto) {
      mostrarResultados(resultadosFiltrados);
      return;
    }

    const filtrados = resultadosFiltrados.filter(p =>
      p.alumno.toLowerCase().includes(texto)
    );
    mostrarResultados(filtrados);

    const nombresUnicos = [...new Set(filtrados.map(p => p.alumno))];

    nombresUnicos.forEach(nombre => {
      const sugerencia = document.createElement('div');
      sugerencia.textContent = nombre;
      sugerencia.addEventListener('click', () => {
        buscadorInput.value = nombre;
        sugerenciasDiv.innerHTML = '';
        const exacto = resultadosFiltrados.filter(p =>
          p.alumno.toLowerCase() === nombre.toLowerCase()
        );
        mostrarResultados(exacto);
      });
      sugerenciasDiv.appendChild(sugerencia);
    });
  };

  // Eventos
  gradoSelect.addEventListener('change', actualizarTabla);
  seccionSelect.addEventListener('change', actualizarTabla);
  mesSelect.addEventListener('change', actualizarTabla);
  buscadorInput.addEventListener('input', filtrarPorAlumno);
  buscadorInput.addEventListener('blur', () => {
    setTimeout(() => sugerenciasDiv.innerHTML = '', 150);
  });
  btnDeudores.addEventListener('click', mostrarDeudores);
}
