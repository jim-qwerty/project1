import '/resources/css/forms/asistencia/registroAlumnos.css';

export default function initRegistroAlumnos(container = document.querySelector('.ra-wrapper')) {
  if (!container) return;

  // Referencias a elementos
  const fechaInput   = container.querySelector('#fechaActual');
  const gradoInput   = container.querySelector('input[name="grado"]');
  const seccionInput = container.querySelector('input[name="seccion"]');
  const tbody        = container.querySelector('#ra-tbody');

  // 1) Inicializar la fecha de hoy
  if (fechaInput) {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm   = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd   = String(hoy.getDate()).padStart(2, '0');
    fechaInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // 2) Función que simula obtener alumnos según grado y sección
  //    Sustituye esto por un fetch real a tu API cuando la tengas:
  async function obtenerAlumnos(grado, seccion) {
    const todos = [
      { id: 1, nombre: 'Luis Contreras', grado: '1', seccion: 'A' },
      { id: 2, nombre: 'Pedro Ruiz',     grado: '1', seccion: 'B' },
      { id: 3, nombre: 'Ana Torres',     grado: '2', seccion: 'A' },
      // … otros alumnos
    ];
    // Filtramos localmente
    return todos.filter(a => a.grado === grado && a.seccion === seccion);
  }

  // 3) Función que limpia el <tbody> y lo rellena con los alumnos
  async function cargarTabla() {
    const grado   = gradoInput.value.trim();
    const seccion = seccionInput.value.trim();

    // Solo procedemos si ambos campos no están vacíos
    if (!grado || !seccion) {
      tbody.innerHTML = '';
      return;
    }

    const alumnos = await obtenerAlumnos(grado, seccion);

    // Vaciamos filas anteriores
    tbody.innerHTML = '';

    if (alumnos.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5">No hay alumnos para grado "${grado}" sección "${seccion}".</td>`;
      tbody.appendChild(tr);
      return;
    }

    // Crear fila por alumno
    alumnos.forEach((al, idx) => {
      const tr = document.createElement('tr');

      // Nº
      tr.innerHTML += `<td>${idx + 1}</td>`;
      // Nombre
      tr.innerHTML += `<td>${al.nombre}</td>`;

      // Estados P, T, F
      ['P','T','F'].forEach(estado => {
        // Para “P” agregamos required al primer radio
        const req = estado === 'P' ? 'required' : '';
        tr.innerHTML += `
          <td>
            <label>
              <input type="radio" name="estado[${al.id}]" value="${estado}" ${req}>
            </label>
          </td>`;
      });

      // Hidden con el id
      tr.innerHTML += `<input type="hidden" name="alumno_id[${al.id}]" value="${al.id}">`;

      tbody.appendChild(tr);
    });
  }

  // 4) Escuchamos cambios (o “salir de campo”) en grado y sección
  gradoInput.addEventListener('change', cargarTabla);
  seccionInput.addEventListener('change', cargarTabla);

  // Si quieres también disparar la carga al escribir:
  // gradoInput.addEventListener('keyup', cargarTabla);
  // seccionInput.addEventListener('keyup', cargarTabla);

  // 5) (Opcional) Si ya vienen precargados, llamar al inicio
  if (gradoInput.value && seccionInput.value) {
    cargarTabla();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => initRegistroAlumnos());
