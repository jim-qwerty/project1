// listaMatriculas.js
import '/resources/css/forms/matricula/listaMatriculas.css';

export default function initListaMatriculas(container = document.querySelector('.lm-wrapper')) {
  if (!container) return;

  // Datos de ejemplo (normalmente vendrían de un fetch)
  const datosAlumnos = [
    { nombres: 'Juan', apellidos: 'Ramirez Lopez', grado: 'Primero',  seccion: 'A', estado: 'Matriculado' },
    { nombres: 'Juan', apellidos: 'XD', grado: 'Primero',  seccion: 'A', estado: 'Matriculado' },
    { nombres: 'María', apellidos: 'García Pérez',  grado: 'Segundo',  seccion: 'B', estado: 'En proceso' },
    { nombres: 'Carlos', apellidos: 'Ramírez Soto',  grado: 'Primero',  seccion: 'C', estado: 'Retirado' },
    { nombres: 'Ana',  apellidos: 'Torres Díaz',    grado: 'Tercero',  seccion: 'A', estado: 'Matriculado' },
    // ... más alumnos
  ];

  const buscador      = container.querySelector('#buscador');
  const sugerencias   = container.querySelector('#sugerenciasNombres');
  const filtroGrado   = container.querySelector('#filtro-grado');
  const filtroSeccion = container.querySelector('#filtro-seccion');
  const tablaBody     = container.querySelector('#tabla-alumnos tbody');

  // Deja la tabla vacía al inicio
  tablaBody.innerHTML = '';

  // Función para renderizar filas (array de objetos alumno)
  const renderizarTabla = (filas) => {
    tablaBody.innerHTML = '';
    filas.forEach(al => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${al.nombres}</td>
        <td>${al.apellidos}</td>
        <td>${al.grado}</td>
        <td>${al.seccion}</td>
        <td>
          <select class="lm-estado-select">
            <option ${al.estado==='Matriculado'? 'selected':''}>Matriculado</option>
            <option ${al.estado==='En proceso'? 'selected':''}>En proceso</option>
            <option ${al.estado==='Retirado'? 'selected':''}>Retirado</option>
          </select>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  };

  // Filtra datos por grado+sección
  const obtenerFiltrados = () => {
    const g = filtroGrado.value;
    const s = filtroSeccion.value;
    return datosAlumnos.filter(al =>
      (!g || al.grado === g) &&
      (!s || al.seccion === s)
    );
  };

  // Al cambiar grado o sección, recarga toda la tabla
  const onFiltroCambio = () => {
    tablaBody.innerHTML = '';         // limpia
    buscador.value = '';              // limpia buscador
    sugerencias.style.display = 'none';
    if (filtroGrado.value && filtroSeccion.value) {
      renderizarTabla(obtenerFiltrados());
    }
  };
  filtroGrado.addEventListener('change', onFiltroCambio);
  filtroSeccion.addEventListener('change', onFiltroCambio);

  // Sugerencias mientras escribe
  buscador.addEventListener('input', () => {
    const texto = buscador.value.trim().toLowerCase();
    const list = obtenerFiltrados()
      .filter(al => (`${al.nombres} ${al.apellidos}`).toLowerCase().includes(texto))
      .slice(0, 5);

    if (texto && list.length) {
      sugerencias.innerHTML = '';
      list.forEach(al => {
        const div = document.createElement('div');
        div.textContent = `${al.nombres} ${al.apellidos}`;
        div.addEventListener('click', () => {
          // al hacer clic, inserta SOLO esa fila
          renderizarTabla([al]);
          sugerencias.style.display = 'none';
          buscador.value = div.textContent;
        });
        sugerencias.appendChild(div);
      });
      sugerencias.style.display = 'block';
    } else {
      sugerencias.style.display = 'none';
    }
  });

  // Oculta sugerencias al hacer click fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      sugerencias.style.display = 'none';
    }
  });
}
