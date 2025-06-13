// resources/js/forms/asistencia/registroDocente.js
import '/resources/css/forms/asistencia/registroDocente.css';

export default function initRegistroDocente(container = document.querySelector('.rd-wrapper')) {
  if (!container) return;

  // 1) Referencias al DOM
  const nombreInput      = container.querySelector('#nombre');
  const suggestions      = container.querySelector('#suggestions');
  const gradoInput       = container.querySelector('#grado');
  const seccionInput     = container.querySelector('#seccion');
  const fechaSpan        = container.querySelector('#fechaActual');
  const horaSpan         = container.querySelector('#horaActual');
  const form             = container.querySelector('#formRegistroDocente');
  const mensaje          = container.querySelector('#mensajeConfirmacion');

  // 2) CSRF
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  // 3) Reloj
  function actualizarFechaHora() {
    const ahora = new Date();
    fechaSpan.textContent = ahora.toISOString().slice(0,10);
    horaSpan.textContent  = ahora.toTimeString().slice(0,8);
  }
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 1000);

  // 4) Autocomplete docente
  let debounce, selectedDocenteId = null;
  nombreInput.addEventListener('input', () => {
    clearTimeout(debounce);
    selectedDocenteId = null;
    const q = nombreInput.value.trim();
    if (!q) {
      suggestions.innerHTML = '';
      gradoInput.value = '';
      seccionInput.value = '';
      return;
    }
    debounce = setTimeout(async () => {
      try {
        const res = await fetch(`/docentes/filtrar?nombre=${encodeURIComponent(q)}`, {
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          }
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json(); 
        suggestions.innerHTML = data.map(d => `
          <li
            data-id="${d.id}"
            data-grado="${d.grado_nombre}"
            data-seccion="${d.seccion_nombre}"
          >${d.nombres} ${d.apellidos} </li>
        `).join('');
        suggestions.querySelectorAll('li').forEach(li => {
          li.addEventListener('click', () => {
            selectedDocenteId   = li.dataset.id;
            nombreInput.value   = li.textContent;
            gradoInput.value    = li.dataset.grado;
            seccionInput.value  = li.dataset.seccion;
            suggestions.innerHTML = '';
          });
        });
      } catch(err) {
        console.error('Error buscando docentes:', err);
      }
    }, 300);
  });

  document.addEventListener('click', e => {
    if (!container.contains(e.target)) suggestions.innerHTML = '';
  });

  // 5) Envío de formulario
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!selectedDocenteId) {
      mensaje.textContent = '❌ Selecciona un docente válido de la lista.';
      return;
    }
    const fecha = fechaSpan.textContent;
    const hora  = horaSpan.textContent;

    try {
      const res = await fetch('/asistencia-docentes', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          docente_id:   parseInt(selectedDocenteId, 10),
          fecha:        fecha,
          hora_registro: hora
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || res.statusText);
      }
      mensaje.textContent = '✅ Asistencia registrada correctamente.';
    } catch(err) {
      console.error('Error guardando asistencia:', err);
      mensaje.textContent = '❌ Error al registrar asistencia.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initRegistroDocente());
