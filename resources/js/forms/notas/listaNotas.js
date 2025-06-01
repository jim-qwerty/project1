import html from './listaNotas.html?raw';
import styles from './listaNotas.css?inline';

class ListaNotas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const grado = this.shadowRoot.getElementById('gradoSelect');
    const seccion = this.shadowRoot.getElementById('seccionSelect');
    const curso = this.shadowRoot.getElementById('cursoSelect');
    const bimestre = this.shadowRoot.getElementById('bimestreSelect');
    const tabla = this.shadowRoot.getElementById('tablaNotas');
    const btnReporte = this.shadowRoot.getElementById('btnReporte');
    const form = this.shadowRoot.getElementById('formReporteNotas');

    const datosNotas = {
      '1-A': [
        { nombre: 'Pedro García', c1: 'A', c2: 'B', c3: 'A', final: 'A' },
        { nombre: 'María Torres', c1: 'B', c2: 'B', c3: 'C', final: 'B' }
      ],
      '2-B': [
        { nombre: 'Luis Fernández', c1: 'A', c2: 'A', c3: 'A', final: 'A' }
      ],
    };

    const mostrarTabla = () => {
      const clave = `${grado.value}-${seccion.value}`;
      const notas = datosNotas[clave] || [];

      if (grado.value && seccion.value && curso.value && bimestre.value && notas.length > 0) {
        let htmlTabla = `
          <table>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Competencia 1</th>
                <th>Competencia 2</th>
                <th>Competencia 3</th>
                <th>Nota Final</th>
              </tr>
            </thead>
            <tbody>
        `;

        notas.forEach(n => {
          htmlTabla += `
            <tr>
              <td>${n.nombre}</td>
              <td>${n.c1}</td>
              <td>${n.c2}</td>
              <td>${n.c3}</td>
              <td>${n.final}</td>
            </tr>
          `;
        });

        htmlTabla += '</tbody></table>';
        tabla.innerHTML = htmlTabla;
        btnReporte.style.display = 'inline-block';
      } else {
        tabla.innerHTML = '';
        btnReporte.style.display = 'none';
      }
    };

    grado.addEventListener('change', mostrarTabla);
    seccion.addEventListener('change', mostrarTabla);
    curso.addEventListener('change', mostrarTabla);
    bimestre.addEventListener('change', mostrarTabla);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('📄 Reporte de notas generado correctamente.');
      // Aquí puedes implementar generación de PDF o exportación si deseas
    });
  }
}

customElements.define('lista-notas', ListaNotas);
