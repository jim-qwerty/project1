import html from '/forms/matricula/listaMatriculas.html?raw';
import styles from '/forms/matricula/listaMatriculas.css?inline';

class ListaMatriculas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const shadow = this.shadowRoot;

    const buscador = shadow.getElementById('buscador');
    const filtroGrado = shadow.getElementById('filtro-grado');
    const tabla = shadow.getElementById('tabla-alumnos')?.getElementsByTagName('tbody')[0];

    if (!buscador || !filtroGrado || !tabla) {
      console.warn("Elementos no encontrados en listaMatriculas");
      return;
    }

    buscador.addEventListener('keyup', filtrarTabla);
    filtroGrado.addEventListener('change', filtrarTabla);

    function filtrarTabla() {
      const texto = buscador.value.toLowerCase();
      const grado = filtroGrado.value.toLowerCase();

      Array.from(tabla.rows).forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        const gradoFila = fila.cells[2]?.textContent.toLowerCase(); // Ajusta el índice si es necesario

        const coincideTexto = textoFila.includes(texto);
        const coincideGrado = grado === "" || gradoFila === grado;

        fila.style.display = coincideTexto && coincideGrado ? "" : "none";
      });
    }
  }
}

customElements.define('lista-matriculas', ListaMatriculas);