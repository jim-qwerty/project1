import '/resources/css/forms/asistencia/registroDocente.css'; // Asegúrate que Vite procese este archivo

export default function initRegistroDocente(container = document.querySelector('registro-docente')) {
  if (!container) return;

  // Referencias a los elementos
  const fechaSpan = container.querySelector('#fechaActual');
  const horaSpan = container.querySelector('#horaActual');
  const form = container.querySelector('#formRegistroDocente');
  const mensaje = container.querySelector('#mensajeConfirmacion');

  const actualizarFechaHora = () => {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    const dd = String(ahora.getDate()).padStart(2, '0');
    const hh = String(ahora.getHours()).padStart(2, '0');
    const min = String(ahora.getMinutes()).padStart(2, '0');
    const ss = String(ahora.getSeconds()).padStart(2, '0');

    if (fechaSpan) fechaSpan.textContent = `${yyyy}-${mm}-${dd}`;
    if (horaSpan) horaSpan.textContent = `${hh}:${min}:${ss}`;
  };

  // Iniciar la actualización de fecha y hora
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 1000);

  // Manejar el envío del formulario
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre  = container.querySelector('#nombre')?.value.trim();
    const grado   = container.querySelector('#grado')?.value.trim();
    const seccion = container.querySelector('#seccion')?.value.trim();
    const fecha   = fechaSpan?.textContent;
    const hora    = horaSpan?.textContent;

    if (mensaje && nombre && grado && seccion && fecha && hora) {
      mensaje.textContent = `✅ Asistencia registrada para ${nombre} (Grado: ${grado} – Sección: ${seccion}) el ${fecha} a las ${hora}`;
    }
  });
}
