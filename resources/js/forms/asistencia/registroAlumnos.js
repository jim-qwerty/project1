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
  const form          = container.querySelector('form.ra-form');

  // 3) CSRF token para las peticiones
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // 4) Inicializar placeholder de la fecha de hoy
  if (fechaInput) {
    const hoy = new Date();
    fechaInput.placeholder = hoy.toISOString().slice(0, 10);
  }

  // 5) Helper para poblar un <select> con datos
  function poblarSelect(selectEl, datos) {
    selectEl.innerHTML = '<option value="">--Selecciona--</option>';
    datos.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.nombre;
      selectEl.appendChild(opt);
    });
  }

  // 6) Poblamos los selects de grado y sección
  poblarSelect(gradoSelect, gradosEstaticos);
  poblarSelect(seccionSelect, seccionesEstaticas);

  // 7) Función para traer alumnos desde la BD según grado_id y seccion_id
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
        grado_id: parseInt(gradoId, 10),
        seccion_id: parseInt(seccionId, 10),
      })
    });
    if (!res.ok) {
      console.error('Error cargando alumnos:', res.statusText);
      return [];
    }
    const data = await res.json(); // [{ id, nombre_completo }]
    return data.map(a => ({ id: a.id, nombre: a.nombre_completo }));
  }

  // 8) Función que limpia y vuelve a poblar la tabla
  async function cargarTabla() {
    tbody.innerHTML = ''; // limpiar siempre primero

    const fecha    = fechaInput.value.trim();
    const gradoId  = gradoSelect.value;
    const seccionId= seccionSelect.value;

    if (!fecha || !gradoId || !seccionId) return;

    const alumnos = await obtenerAlumnosDesdeBD(gradoId, seccionId);

    if (alumnos.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5">
        No hay alumnos para grado "${gradoSelect.options[gradoSelect.selectedIndex].text}"
        sección "${seccionSelect.options[seccionSelect.selectedIndex].text}" el ${fecha}.
      </td>`;
      tbody.appendChild(tr);
      return;
    }

    alumnos.forEach((al, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${idx + 1}</td><td>${al.nombre}</td>`;
      ['P','T','F'].forEach(estado => {
        const req = estado === 'P' ? 'required' : '';
        tr.innerHTML += `
          <td>
            <label>
              <input
                type="radio"
                name="estado[${al.id}]"
                value="${estado}"
                ${req}
              >
            </label>
          </td>`;
      });
      tr.innerHTML += `<input type="hidden" name="alumno_id[${al.id}]" value="${al.id}">`;
      tbody.appendChild(tr);
    });
  }

  // 9) Listeners para recargar la tabla al cambiar fecha, grado o sección
  fechaInput.addEventListener('change', cargarTabla);
  gradoSelect.addEventListener('change', cargarTabla);
  seccionSelect.addEventListener('change', cargarTabla);

  // 10) Interceptar envío del form y enviar a la BD
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fecha    = fechaInput.value.trim();
    const gradoId  = parseInt(gradoSelect.value, 10);
    const seccionId= parseInt(seccionSelect.value, 10);

    // Recolectar asistencias
    const filas = Array.from(tbody.querySelectorAll('tr'));
    const asistencias = filas.map(tr => {
      const alumnoId = tr.querySelector('input[type="hidden"]').value;
      const estadoEl = tr.querySelector(`input[name="estado[${alumnoId}]"]:checked`);
      return {
        alumno_id:   parseInt(alumnoId, 10),
        fecha:       fecha,
        estado:      estadoEl ? estadoEl.value : null,
        grado_id:    gradoId,
        seccion_id:  seccionId
      };
    }).filter(a => a.estado);

    // Enviar al controlador
    try {
      const res = await fetch('/asistencia-alumnos', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({ asistencias })
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Asistencias guardadas correctamente');
    } catch (err) {
      console.error('Error guardando asistencias:', err);
      alert('❌ Error al guardar');
    }
  });

  // 11) Carga inicial si ya hay valores preestablecidos
  if (fechaInput.value && gradoSelect.value && seccionSelect.value) {
    cargarTabla();
  }
}

// Inicializar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initRegistroAlumnos());
