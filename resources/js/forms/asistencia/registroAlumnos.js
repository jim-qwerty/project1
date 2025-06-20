import '/resources/css/forms/asistencia/registroAlumnos.css';
import { initGradosSecciones } from '../utils/loadGradosSecciones.js';

export default async function initRegistroAlumnos(container = document.querySelector('.ra-wrapper')) {
  if (!container) return;

  // 1) Referencias al DOM
  const fechaInput    = container.querySelector('#fechaActual');
  const gradoSelect   = container.querySelector('#gradoSelect');
  const seccionSelect = container.querySelector('#seccionSelect');
  const tbody         = container.querySelector('#ra-tbody');
  const form          = container.querySelector('form.ra-form');

  // 2) CSRF token para las peticiones
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // 3) Inicializar placeholder de la fecha de hoy
  if (fechaInput) {
    const hoy = new Date();
    fechaInput.placeholder = hoy.toISOString().slice(0, 10);
  }

  // 4) Carga dinámica de grados y secciones
  try {
    await initGradosSecciones(gradoSelect, seccionSelect);
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    gradoSelect.innerHTML   = '<option value="">Error cargando grados</option>';
    seccionSelect.innerHTML = '<option value="">Error cargando secciones</option>';
  }

  // 5) Función para traer alumnos según grado y sección
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
        grado_id:   parseInt(gradoId, 10),
        seccion_id: parseInt(seccionId, 10)
      })
    });
    if (!res.ok) {
      console.error('Error cargando alumnos:', res.statusText);
      return [];
    }
    const data = await res.json(); // [{ id, nombre_completo }]
    return data.map(a => ({ id: a.id, nombre: a.nombre_completo }));
  }

  // 6) Función que limpia y vuelve a poblar la tabla
  async function cargarTabla() {
    tbody.innerHTML = '';
    const fecha     = fechaInput.value.trim();
    const gradoId   = gradoSelect.value;
    const seccionId = seccionSelect.value;
    if (!fecha || !gradoId || !seccionId) return;

    const alumnos = await obtenerAlumnosDesdeBD(gradoId, seccionId);
    if (alumnos.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5">
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

  // 7) Listeners para recargar la tabla al cambiar fecha, grado o sección
  fechaInput.addEventListener('change', cargarTabla);
  gradoSelect.addEventListener('change', cargarTabla);
  seccionSelect.addEventListener('change', cargarTabla);

  // 8) Interceptar envío del form y enviar a la BD
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fecha     = fechaInput.value.trim();
    const gradoId   = parseInt(gradoSelect.value, 10);
    const seccionId = parseInt(seccionSelect.value, 10);

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

  // 9) Carga inicial si ya hay valores preestablecidos
  if (fechaInput.value && gradoSelect.value && seccionSelect.value) {
    cargarTabla();
  }
}

// Inicializar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initRegistroAlumnos());
