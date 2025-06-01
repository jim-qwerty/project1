import html from '/forms/asistencia/historialAsistencia.html?raw';
import styles from '/forms/asistencia/historialAsistencia.css?inline';

class historialAsistencia extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const mesInput = this.shadowRoot.getElementById('mes');
    if (mesInput) {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      mesInput.value = `${yyyy}-${mm}`;
    }

    const form = this.shadowRoot.getElementById('formResumenMensual');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generarTabla();
    });
  }

  generarTabla() {
  const nombre = this.shadowRoot.getElementById('nombreAlumno').value.toLowerCase();
  const grado = this.shadowRoot.getElementById('grado').value;
  const mes = this.shadowRoot.getElementById('mes').value;

  if (!mes) return;

  const year = parseInt(mes.split('-')[0]);
  const month = parseInt(mes.split('-')[1]);
  const diasEnMes = new Date(year, month, 0).getDate();

  // Datos simulados
  const alumnos = [
    { nombre: 'Ana Torres', grado: '1', asistencia: this.generarAsistencia(diasEnMes) },
    { nombre: 'Luis Perez', grado: '2', asistencia: this.generarAsistencia(diasEnMes) },
    { nombre: 'María López', grado: '1', asistencia: this.generarAsistencia(diasEnMes) },
  ];

  const filtrados = alumnos.filter(al => {
    const nombreCoincide = al.nombre.toLowerCase().includes(nombre);
    const gradoCoincide = grado === '' || al.grado === grado;
    return nombreCoincide && gradoCoincide;
  });

  let tablaHtml = `<table><thead><tr><th>Alumno</th>`;
  for (let d = 1; d <= diasEnMes; d++) {
    tablaHtml += `<th style="width: 25px;">${d}</th>`;
  }
  tablaHtml += `</tr></thead><tbody>`;

  for (const al of filtrados) {
    tablaHtml += `<tr><td class="nombre">${al.nombre}</td>`;
    for (let d = 0; d < diasEnMes; d++) {
      const estado = al.asistencia[d]; // 'P', 'T', 'F'
      tablaHtml += `<td data-estado="${estado}">${estado}</td>`;
    }
    tablaHtml += `</tr>`;
  }

  tablaHtml += `</tbody></table>`;
  this.shadowRoot.getElementById('tablaResumen').innerHTML = tablaHtml;
}


  generarAsistencia(dias) {
    // Devuelve un array de 'P', 'T', 'F' aleatoriamente
    const estados = ['P', 'T', 'F'];
    return Array.from({ length: dias }, () => estados[Math.floor(Math.random() * 3)]);
  }
}

customElements.define('historial-asistencia', historialAsistencia);
