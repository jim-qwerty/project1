import '/resources/css/forms/matricula/listaMatriculas.css'; // Importa el CSS para que Vite lo procese

// Esta función se debe llamar después de cargar la vista Blade
export default async function initListaMatriculas(container = document.querySelector('lista-matriculas')) {
  if (!container) return;


    // Referencias a elementos
    const buscador = container.querySelector('#buscador');
    const filtroGrado = container.querySelector('#filtro-grado');
    const tabla = container.querySelector('#tabla-alumnos tbody');

    if (!buscador || !filtroGrado || !tabla) {
      console.warn("Elementos no encontrados en listaMatriculas");
      return;
    }

    // Función para filtrar tabla
    const filtrarTabla = () => {
      const texto = buscador.value.toLowerCase();
      const grado = filtroGrado.value.toLowerCase();

      Array.from(tabla.rows).forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        const gradoFila = fila.cells[2]?.textContent.toLowerCase(); // Ajusta índice si hace falta

        const coincideTexto = textoFila.includes(texto);
        const coincideGrado = grado === "" || gradoFila === grado;

        fila.style.display = coincideTexto && coincideGrado ? "" : "none";
      });
    };

    // Eventos
    buscador.addEventListener('keyup', filtrarTabla);
    filtroGrado.addEventListener('change', filtrarTabla);

  
}
