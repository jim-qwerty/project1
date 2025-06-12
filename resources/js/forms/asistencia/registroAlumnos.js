// resources/js/forms/asistencia/registroAlumnos.js
import '/resources/css/forms/asistencia/registroAlumnos.css';

export default function initRegistroAlumnos(container = document.querySelector('.ra-wrapper')) {
  if (!container) return;

  // 1) Arrays estáticos para los selects
  const gradosEstaticos = [
    { id: 1, nombre: '3 años' },
    { id: 2, nombre: '4 años' },
    { id: 3, nombre: '5 años' },
    { id: 4, nombre: 'Primero' },
    { id: 5, nombre: 'Segundo' },
    { id: 6, nombre: 'Tercero' },
    { id: 7, nombre: 'Cuarto' },
    { id: 8, nombre: 'Quinto' },
    { id: 9, nombre: 'Sexto' }
  ];
  const seccionesEstaticas = [
    { id: 1, nombre: 'A' },
    { id: 2, nombre: 'B' },
    { id: 3, nombre: 'C' }
  ];

  // 2) Referencias al DOM
  const fechaInput    = container.querySelector('#fechaActual');
  const gradoSelect   = container.querySelector('#gradoSelect');
  const seccionSelect = container.querySelector('#seccionSelect');
  const tbody         = container.querySelector('#ra-tbody');

  // 3) CSRF token para los fetch
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // 4) Inicializar placeholder de fecha (editable)
  if (fechaInput) {
    const hoy = new Date();
    fechaInput.placeholder = hoy.toISOString().slice(0,10);
  }

  // 5) Helper para poblar un <select>
  function poblarSelect(selectEl, datos) {
    selectEl.innerHTML = '<option value="">--Selecciona--</option>';
    datos.forEach(item => {
      const o = document.createElement('option');
      o.value = item.id;
      o.textContent = item.nombre;
      selectEl.appendChild(o);
    });
  }

  // 6) Poblamos grado y sección con datos estáticos
  poblarSelect(gradoSelect, gradosEstaticos);
  poblarSelect(seccionSelect, seccionesEstaticas);

  // 7) Función real que trae alumnos desde la BD
  async function obtenerAlumnosDesdeBD(gradoId, seccionId) {
    const res = await fetch('/alumnos/filtrar', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({
        grado_id: parseInt(gradoId),
        seccion_id: parseInt(seccionId)
      })
    });
    if (!res.ok) {
      console.error('Fallo al cargar alumnos:', res.statusText);
      return [];
    }
    // El endpoint debe devolver [{id,nombre_completo},…]
    const data = await res.json();
    return data.map(a => ({ id: a.id, nombre: a.nombre_completo }));
  }

  // 8) Cargar la tabla de asistencia
  async function cargarTabla() {
    const grado   = gradoSelect.value;
    const seccion = seccionSelect.value;
    const fecha   = fechaInput.value.trim(); // si necesitas usarla

    tbody.innerHTML = '';
    if (!fecha || !grado || !seccion) return;

    // Trae alumnos reales
    const alumnos = await obtenerAlumnosDesdeBD(grado, seccion);
    if (alumnos.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5">No hay alumnos para grado "${grado}" sección "${seccion}" el ${fecha}.</td>`;
      tbody.appendChild(tr);
      return;
    }

    // Construye filas
    alumnos.forEach((al, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${idx + 1}</td><td>${al.nombre}</td>`;
      // Radios P, T, F
      ['P','T','F'].forEach(estado => {
        const req = estado === 'P' ? 'required' : '';
        tr.innerHTML += `
          <td>
            <label>
              <input type="radio" name="estado[${al.id}]" value="${estado}" ${req}>
            </label>
          </td>`;
      });
      // Campo oculto con el ID
      tr.innerHTML += `<input type="hidden" name="alumno_id[${al.id}]" value="${al.id}">`;
      tbody.appendChild(tr);
    });
  }

  // 9) Disparamos la carga al cambiar fecha, grado o sección
  fechaInput.addEventListener('change', cargarTabla);
  gradoSelect.addEventListener('change', cargarTabla);
  seccionSelect.addEventListener('change', cargarTabla);

  // 10) Si ya vienen valores (edición), cargamos al inicio
  if (fechaInput.value && gradoSelect.value && seccionSelect.value) {
    cargarTabla();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => initRegistroAlumnos());
