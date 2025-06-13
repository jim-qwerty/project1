import '/resources/css/forms/asistencia/registroDocente.css';

export default function initRegistroDocente(container = document.querySelector('.rd-wrapper')) {
  if (!container) return;

  // 1) Referencias
  const nombreInput  = container.querySelector('#nombre');
  const suggestions  = container.querySelector('#suggestions');
  const gradoInput   = container.querySelector('#grado');
  const seccionInput = container.querySelector('#seccion');
  const fechaSpan    = container.querySelector('#fechaActual');
  const horaSpan     = container.querySelector('#horaActual');
  const form         = container.querySelector('#formRegistroDocente');
  const mensaje      = container.querySelector('#mensajeConfirmacion');

  // 2) CSRF para fetch
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
  let debounce;
  nombreInput.addEventListener('input', () => {
    clearTimeout(debounce);
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
          headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken }
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json(); 
        // data = [{ id, apellidos, nombres, grado_nombre, seccion_nombre }, ...]
        suggestions.innerHTML = data.map(d => `
          <li
            data-grado="${d.grado_nombre}"
            data-seccion="${d.seccion_nombre}"
          >${d.nombres} ${d.apellidos}</li>
        `).join('');
        // click en sugerencia
        suggestions.querySelectorAll('li').forEach(li => {
          li.addEventListener('click', () => {
            nombreInput.value  = li.textContent;
            gradoInput.value   = li.dataset.grado;
            seccionInput.value = li.dataset.seccion;
            suggestions.innerHTML = '';
          });
        });
      } catch(err) {
        console.error('Error buscando docentes:', err);
      }
    }, 300);
  });

  // cierra sugerencias al clicar fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) suggestions.innerHTML = '';
  });

  // 5) Envío de formulario
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre  = nombreInput.value.trim();
    const grado   = gradoInput.value.trim();
    const seccion = seccionInput.value.trim();
    const fecha   = fechaSpan.textContent;
    const hora    = horaSpan.textContent;
    if (nombre && grado && seccion) {
      // Aquí podrías hacer un fetch POST a tu ruta de store de asistencia_docentes
      // Por simplicidad: mostramos mensaje
      mensaje.textContent = `✅ Asistencia registrada: ${nombre} – Grado ${grado}, Sección ${seccion} – ${fecha} ${hora}`;
    } else {
      mensaje.textContent = '❌ Por favor selecciona un docente válido.';
    }
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => initRegistroDocente());
