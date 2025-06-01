import html from './registroNotas.html?raw';
import styles from './registroNotas.css?inline';

class RegistroNotas extends HTMLElement {
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
    const cursoSelect = this.shadowRoot.getElementById('cursoSelect');
    const bimestreSelect = this.shadowRoot.getElementById('bimestreSelect');
    const panelNotas = this.shadowRoot.getElementById('panelNotas');
    const nombreAlumno = this.shadowRoot.getElementById('nombreAlumno');
    const buscarInput = this.shadowRoot.getElementById('buscarAlumno');
    const listaResultados = this.shadowRoot.getElementById('listaResultados');
    const form = this.shadowRoot.getElementById('formularioNotas');
    const mensaje = this.shadowRoot.getElementById('mensajeConfirmacion');
    const btnSiguiente = this.shadowRoot.getElementById('btnSiguiente');

    let alumnos = [];
    let alumnoActual = "";
    let indiceAlumno = 0;

    const cargarAlumnos = () => {
      const grado = gradoSelect.value;
      const seccion = seccionSelect.value;
      const curso = cursoSelect.value;
      const bimestre = bimestreSelect.value;

      const clave = `${grado}-${seccion}`;
      alumnos = alumnosPorGradoSeccion[clave] || [];
      indiceAlumno = 0;

      if (grado && seccion && curso && bimestre && alumnos.length > 0) {
        alumnoActual = alumnos[indiceAlumno];
        nombreAlumno.textContent = alumnoActual;
        panelNotas.style.display = 'block';
      } else {
        alumnoActual = "";
        nombreAlumno.textContent = "---";
        panelNotas.style.display = 'none';
      }
    };

    gradoSelect.addEventListener('change', cargarAlumnos);
    seccionSelect.addEventListener('change', cargarAlumnos);
    cursoSelect.addEventListener('change', cargarAlumnos);
    bimestreSelect.addEventListener('change', cargarAlumnos);

    buscarInput.addEventListener('input', () => {
      const texto = buscarInput.value.trim().toLowerCase();
      listaResultados.innerHTML = '';
      if (texto.length === 0) return;

      const coincidencias = alumnos.filter(nombre =>
        nombre.toLowerCase().includes(texto)
      );

      coincidencias.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
          alumnoActual = nombre;
          nombreAlumno.textContent = nombre;
          indiceAlumno = alumnos.indexOf(nombre);
          listaResultados.innerHTML = '';
        });
        listaResultados.appendChild(li);
      });
    });

    btnSiguiente.addEventListener('click', () => {
      if (alumnos.length === 0) return;

      indiceAlumno = (indiceAlumno + 1) % alumnos.length;
      alumnoActual = alumnos[indiceAlumno];
      nombreAlumno.textContent = alumnoActual;

      const radios = this.shadowRoot.querySelectorAll('input[type="radio"]');
      radios.forEach(r => r.checked = false);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!alumnoActual) return;
      mensaje.textContent = `✅ Notas registradas para ${alumnoActual}.`;
    });
  }
}

customElements.define('registro-notas', RegistroNotas);
