console.log("AGREGAR PROFESORES");

import '/resources/css/forms/profesores/agregarProfesores.css';

// Usamos un ID más confiable para seleccionar el contenedor principal
export default function initAgregarProfesores(container = document.querySelector('#agregar-profesores')) {
  if (!container) {
    console.warn("No se encontró el contenedor #agregar-profesores");
    return;
  }

  const form = container.querySelector('#formulario-profesor');
  const mensaje = container.querySelector('#mensaje'); // Puedes añadir este div si aún no lo tienes

  const fechaNacimiento = container.querySelector('#fechaNacimiento');
  const edadInput = container.querySelector('#edad');

  if (!form || !fechaNacimiento || !edadInput) {
    console.warn("No se encontraron algunos elementos del formulario.");
    return;
  }

  // Calcular edad al cambiar la fecha de nacimiento
  fechaNacimiento.addEventListener('change', () => {
    const fecha = new Date(fechaNacimiento.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }

    edadInput.value = isNaN(edad) ? '' : `${edad}`;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const profesor = {
      nombre: form.querySelector('input[placeholder="Ingrese nombres"]').value.trim(),
      apellido: form.querySelector('input[placeholder="Ingrese apellidos"]').value.trim(),
      dni: form.querySelector('input[placeholder="Ingrese DNI"]').value.trim(),
      correo: form.querySelector('input[type="email"]').value.trim(),
      telefono: form.querySelector('input[placeholder="Ingrese número"]').value.trim(),
      grado: form.querySelector('select:nth-of-type(1)').value,
      seccion: form.querySelector('select:nth-of-type(2)').value,
      fechaNacimiento: fechaNacimiento.value,
      edad: edadInput.value
    };

    console.log('Profesor registrado:', profesor);

    if (mensaje) {
      mensaje.textContent = '✅ Profesor registrado correctamente.';
      mensaje.style.color = 'green';

      setTimeout(() => {
        mensaje.textContent = '';
      }, 3000);
    }

    form.reset();
    edadInput.value = ''; // Limpiar edad manualmente
  });
}
