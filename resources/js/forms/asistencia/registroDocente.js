import html from '/forms/asistencia/registroDocente.html?raw';
import styles from '/forms/asistencia/registroDocente.css?inline';

class RegistroDocente extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const fechaSpan = this.shadowRoot.getElementById('fechaActual');
    const horaSpan = this.shadowRoot.getElementById('horaActual');
    const form = this.shadowRoot.getElementById('formRegistroDocente');
    const mensaje = this.shadowRoot.getElementById('mensajeConfirmacion');

    const actualizarFechaHora = () => {
      const ahora = new Date();
      const yyyy = ahora.getFullYear();
      const mm = String(ahora.getMonth() + 1).padStart(2, '0');
      const dd = String(ahora.getDate()).padStart(2, '0');
      const hh = String(ahora.getHours()).padStart(2, '0');
      const min = String(ahora.getMinutes()).padStart(2, '0');
      const ss = String(ahora.getSeconds()).padStart(2, '0');

      fechaSpan.textContent = `${yyyy}-${mm}-${dd}`;
      horaSpan.textContent = `${hh}:${min}:${ss}`;
    };

    // Actualiza cada segundo
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    // Al enviar el formulario
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = this.shadowRoot.getElementById('nombre').value;
      const grado = this.shadowRoot.getElementById('grado').value;
      const fecha = fechaSpan.textContent;
      const hora = horaSpan.textContent;

      mensaje.textContent = `✅ Asistencia registrada para ${nombre} (${grado}) el ${fecha} a las ${hora}`;
    });
  }
}

customElements.define('registro-docente', RegistroDocente);
