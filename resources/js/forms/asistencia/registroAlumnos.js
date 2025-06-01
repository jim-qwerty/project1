import html from '/forms/asistencia/registroAlumnos.html?raw';
import styles from '/forms/asistencia/registroAlumnos.css?inline';

class RegistroAlumnos extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Espera a que el contenido esté cargado
    const fechaInput = this.shadowRoot.getElementById('fechaActual');
    if (fechaInput) {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      fechaInput.value = `${yyyy}-${mm}-${dd}`;
    }
  }
}

customElements.define('registro-alumnos', RegistroAlumnos);
