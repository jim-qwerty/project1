console.log("LLEGADA 2");
import '/resources/css/forms/matricula/matricula.css'; // Importa el CSS para que Vite lo procese


// Esta función se debe llamar después de cargar la vista Blade
export default function initMatriculaForm(container = document.getElementById('form-container')) {
  if (!container) return;

  const fechaNacimiento = container.querySelector("#fecha-nacimiento");
  const edad = container.querySelector("#edad");
  const nivel = container.querySelector("#nivel-educativo");
  const grado = container.querySelector("#grado");
  const form = container.querySelector('#matricula-form');
  const pagoForm = container.querySelector('#pago-form');
  const mensaje = container.querySelector('#mensaje');
  const confirmacion = container.querySelector('#confirmacion');
  const btnSi = container.querySelector('#btn-si');
  const btnNo = container.querySelector('#btn-no');
  const confirmacionMensaje = container.querySelector('#confirmacion-mensaje');
  const btnRegresar = container.querySelector('#regresar-btn');

  const mostrarMensaje = (texto) => {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.style.display = 'block';
    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 4000);
  };

  const confirmarAccion = (texto, callback) => {
    if (!confirmacion) return;
    confirmacion.style.display = 'flex';
    confirmacionMensaje.textContent = texto;

    const cerrarConfirmacion = () => {
      confirmacion.style.display = 'none';
    };

    btnSi.onclick = () => {
      cerrarConfirmacion();
      callback(true);
    };

    btnNo.onclick = () => {
      cerrarConfirmacion();
      callback(false);
    };
  };

  // Calcular edad al seleccionar fecha
  if (fechaNacimiento && edad) {
    fechaNacimiento.addEventListener("change", () => {
      const birthDate = new Date(fechaNacimiento.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      edad.value = isNaN(age) ? '' : age;
    });
  }

  // Actualizar grados según nivel educativo
  if (nivel && grado) {
    nivel.addEventListener("change", () => {
      const opciones = {
        Inicial: ["3 años", "4 años", "5 años"],
        Primaria: ["primero", "segundo", "tercero", "cuarto", "quinto", "sexto"]
      }[nivel.value] || [];

      grado.innerHTML = '<option value="">Seleccione grado</option>';
      opciones.forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        grado.appendChild(option);
      });
    });
  }

  // Submisión del formulario de matrícula
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      confirmarAccion("¿Deseas continuar al pago de matrícula?", (confirmado) => {
        if (!confirmado) return;

        const resumenNombre = container.querySelector('#resumen-nombre');
        const resumenDni = container.querySelector('#resumen-dni');
        const nombreAlumno = container.querySelector('input[name="alumno_nombres"]')?.value || '';
        const dniAlumno = container.querySelector('input[name="alumno_dni"]')?.value || '';

        if (resumenNombre) resumenNombre.value = nombreAlumno;
        if (resumenDni) resumenDni.value = dniAlumno;

        form.style.display = 'none';
        if (pagoForm) pagoForm.style.display = 'block';

        mostrarMensaje("Datos de matrícula procesados. Proceda con el pago.");
      });
    });
  }

  // Submisión del formulario de pago
  if (pagoForm) {
    pagoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      confirmarAccion("¿Deseas confirmar el pago?", (confirmado) => {
        if (!confirmado) return;

        mostrarMensaje("¡Pago realizado con éxito!");
        form?.reset();
        pagoForm.reset();
        pagoForm.style.display = 'none';
        form.style.display = 'block';
      });
    });
  }

  // Regresar desde el formulario de pago al formulario de matrícula
  if (btnRegresar) {
    btnRegresar.addEventListener('click', () => {
      pagoForm.style.display = 'none';
      form.style.display = 'block';
    });
  }
}
