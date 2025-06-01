import html from './pagoMensual.html?raw';
import styles from './pagoMensual.css?inline';

class PagoMensual extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const alumnosPorGradoSeccion = {
      '1-A': ['Pedro Garcia', 'Maria Torres', 'Pedro Ramirez'],
      '1-B': ['Luis Fernandez', 'Ana Lopez'],
      '2-A': ['Carlos Ruiz', 'Lucia Vargas'],
      '2-B': ['Pedro Martinez', 'Valeria Gomez'],
      '3-A': ['Diego Vega', 'Fernanda Nuñez'],
      '3-B': ['Sofia Mendoza', 'Andres Salas'],
    };

    const gradoSelect = this.shadowRoot.getElementById('gradoSelect');
    const seccionSelect = this.shadowRoot.getElementById('seccionSelect');
    const alumnoInput = this.shadowRoot.getElementById('alumnoInput');
    const listaCoincidencias = this.shadowRoot.getElementById('listaCoincidencias');
    const mensajePago = this.shadowRoot.getElementById('mensajePago');
    const form = this.shadowRoot.getElementById('formularioPago');

    let alumnos = [];

    const actualizarAlumnosPorGradoSeccion = () => {
      const clave = `${gradoSelect.value}-${seccionSelect.value}`;
      alumnos = alumnosPorGradoSeccion[clave] || [];
      alumnoInput.value = '';
      listaCoincidencias.innerHTML = '';
    };

    const actualizarListaCoincidencias = () => {
  const textoIngresado = alumnoInput.value.trim().toLowerCase();
  listaCoincidencias.innerHTML = '';

  if (textoIngresado === '') return; // Oculta la lista si no hay texto

  const coincidencias = alumnos.filter(nombre =>
    nombre.toLowerCase().includes(textoIngresado)
  );

  coincidencias.forEach(nombre => {
    const li = document.createElement('li');
    li.textContent = nombre;
    li.addEventListener('click', () => {
      alumnoInput.value = nombre;
      listaCoincidencias.innerHTML = '';
    });
    listaCoincidencias.appendChild(li);
  });
};


    alumnoInput.addEventListener('input', actualizarListaCoincidencias);
    gradoSelect.addEventListener('change', actualizarAlumnosPorGradoSeccion);
    seccionSelect.addEventListener('change', actualizarAlumnosPorGradoSeccion);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const alumno = alumnoInput.value.trim();
      if (alumno === '') return;
      mensajePago.textContent = `✅ Pago registrado para ${alumno}.`;
      listaCoincidencias.innerHTML = '';
    });

    // Opcional: cerrar coincidencias al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.shadowRoot.contains(e.target)) {
        listaCoincidencias.innerHTML = '';
      }
    });
  }
}

customElements.define('pago-mensual', PagoMensual);
