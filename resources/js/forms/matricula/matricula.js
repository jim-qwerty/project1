import html from './matricula.html?raw';
import styles from './matricula.css?inline';
console.log("LLEGADA 2")
class MatriculaForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const shadow = this.shadowRoot;

    const fechaNacimiento = shadow.getElementById("fecha-nacimiento");
    const edad = shadow.getElementById("edad");
    const nivel = shadow.getElementById("nivel-educativo");
    const grado = shadow.getElementById("grado");
    const form = shadow.getElementById('matricula-form');
    const pagoForm = shadow.getElementById('pago-form');
    const mensaje = shadow.getElementById('mensaje');
    const confirmacion = shadow.getElementById('confirmacion');
    const btnSi = shadow.getElementById('btn-si');
    const btnNo = shadow.getElementById('btn-no');
    const confirmacionMensaje = shadow.getElementById('confirmacion-mensaje');
    const btnRegresar = shadow.getElementById('regresar-btn');

    function mostrarMensaje(texto) {
      if (mensaje) {
        mensaje.textContent = texto;
        mensaje.style.display = 'block';
        setTimeout(() => mensaje.style.display = 'none', 4000);
      }
    }

    function confirmarAccion(texto, callback) {
      confirmacion.style.display = 'flex';
      confirmacionMensaje.textContent = texto;

      btnSi.onclick = () => {
        confirmacion.style.display = 'none';
        callback(true);
      };

      btnNo.onclick = () => {
        confirmacion.style.display = 'none';
        callback(false);
      };
    }

    if (fechaNacimiento && edad) {
      fechaNacimiento.addEventListener("change", function () {
        const birthDate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        edad.value = age;
      });
    }

    if (nivel && grado) {
      nivel.addEventListener("change", function () {
        let opciones = [];
        if (this.value === "Inicial") {
          opciones = ["3 años", "4 años", "5 años"];
        } else if (this.value === "Primaria") {
          opciones = ["primero", "segundo", "tercero", "cuarto", "quinto", "sexto"];
        }

        grado.innerHTML = '<option value="">Seleccione grado</option>';
        opciones.forEach(op => {
          const option = document.createElement("option");
          option.value = op;
          option.textContent = op;
          grado.appendChild(option);
        });
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        confirmarAccion("¿Deseas continuar al pago de matrícula?", (confirmado) => {
          if (!confirmado) return;

          const nombres = shadow.querySelector('input[placeholder="Ingrese nombres"]')?.value || '';
          const dni = shadow.querySelector('input[placeholder="Ingrese DNI"]')?.value || '';

          const resumenNombre = shadow.getElementById('resumen-nombre');
          const resumenDni = shadow.getElementById('resumen-dni');

          if (resumenNombre) resumenNombre.value = nombres;
          if (resumenDni) resumenDni.value = dni;

          form.style.display = 'none';
          if (pagoForm) pagoForm.style.display = 'block';

          mostrarMensaje("Datos de matrícula procesados. Proceda con el pago.");
        });
      });
    }

    if (pagoForm) {
      pagoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        confirmarAccion("¿Deseas confirmar el pago?", (confirmado) => {
          if (!confirmado) return;

          mostrarMensaje("¡Pago realizado con éxito!");
          form.reset();
          pagoForm.reset();
          pagoForm.style.display = 'none';
          form.style.display = 'block';
        });
      });
    }

    if (btnRegresar) {
      btnRegresar.addEventListener('click', () => {
        pagoForm.style.display = 'none';
        form.style.display = 'block';
      });
    }
  }
}

customElements.define('matricula-form', MatriculaForm);


