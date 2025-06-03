import '/resources/css/forms/asistencia/registroAlumnos.css'; // Asegúrate de que Vite lo procese

export default function initRegistroAlumnos(container = document.querySelector('registro-alumnos')) {
  if (!container) return;

  const fechaInput = container.querySelector('#fechaActual');

  if (fechaInput) {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    fechaInput.value = `${yyyy}-${mm}-${dd}`;
  }
}
