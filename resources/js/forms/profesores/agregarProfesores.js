import html from '/forms/profesores/agregarProfesores.html?raw';
import styles from '/forms/profesores/agregarProfesores.css?inline';

class ProfesorForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const form = this.shadowRoot.getElementById('formProfesor');
    const mensaje = this.shadowRoot.getElementById('mensaje');

    // 🎯 Script para calcular la edad automáticamente
    const fechaNacimiento = this.shadowRoot.getElementById('fechaNacimiento');
    const edadInput = this.shadowRoot.getElementById('edad');

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
        nombre: form.nombre.value.trim(),
        apellido: form.apellido.value.trim(),
        dni: form.dni.value.trim(),
        correo: form.correo.value.trim(),
        telefono: form.telefono.value.trim(),
        grado: form.grado.value,
        seccion: form.seccion.value,
        fechaNacimiento: form.fechaNacimiento.value,
        edad: form.edad.value
      };

      console.log('Profesor registrado:', profesor);

      mensaje.textContent = '✅ Profesor registrado correctamente.';
      form.reset();

      setTimeout(() => {
        mensaje.textContent = '';
      }, 3000);
    });
  }
}

customElements.define('agregar-profesor-form', ProfesorForm);
