import '/resources/css/forms/asistencia/historialAsistencia.css'; // Para que Vite lo procese

export default function initHistorialAsistencia(container = document.querySelector('historial-asistencia')) {
  if (!container) return;

  // Referencias
  const mesInput = container.querySelector('#mes');
  const nombreInput = container.querySelector('#nombreAlumno');
  const gradoInput = container.querySelector('#grado');
  const tabla = container.querySelector('#tablaResumen');
  const form = container.querySelector('#formResumenMensual');

  if (!mesInput || !nombreInput || !gradoInput || !tabla || !form) {
    console.warn('Elementos del formulario no encontrados.');
    return;
  }

  // Setear mes actual por defecto
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  mesInput.value = `${yyyy}-${mm}`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generarTabla();
  });

  function generarTabla() {
    const nombre = nombreInput.value.toLowerCase();
    const grado = gradoInput.value;
    const mes = mesInput.value;

    if (!mes) return;

    const year = parseInt(mes.split('-')[0]);
    const month = parseInt(mes.split('-')[1]);
    const diasEnMes = new Date(year, month, 0).getDate();

    // Datos simulados
    const alumnos = [
      { nombre: 'Ana Torres', grado: '1', asistencia: generarAsistencia(diasEnMes) },
      { nombre: 'Luis Perez', grado: '2', asistencia: generarAsistencia(diasEnMes) },
      { nombre: 'María López', grado: '1', asistencia: generarAsistencia(diasEnMes) },
    ];

    const filtrados = alumnos.filter(al => {
      const nombreCoincide = al.nombre.toLowerCase().includes(nombre);
      const gradoCoincide = grado === '' || al.grado === grado;
      return nombreCoincide && gradoCoincide;
    });

    let tablaHtml = `<table><thead><tr><th>Alumno</th>`;
    for (let d = 1; d <= diasEnMes; d++) {
      tablaHtml += `<th style="width: 25px;">${d}</th>`;
    }
    tablaHtml += `</tr></thead><tbody>`;

    for (const al of filtrados) {
      tablaHtml += `<tr><td class="nombre">${al.nombre}</td>`;
      for (let d = 0; d < diasEnMes; d++) {
        const estado = al.asistencia[d]; // 'P', 'T', 'F'
        tablaHtml += `<td data-estado="${estado}">${estado}</td>`;
      }
      tablaHtml += `</tr>`;
    }

    tablaHtml += `</tbody></table>`;
    tabla.innerHTML = tablaHtml;
  }

  function generarAsistencia(dias) {
    const estados = ['P', 'T', 'F'];
    return Array.from({ length: dias }, () => estados[Math.floor(Math.random() * estados.length)]);
  }
}
