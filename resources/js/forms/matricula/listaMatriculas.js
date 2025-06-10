// resources/js/forms/matricula/listaMatriculas.js

import '/resources/css/forms/matricula/listaMatriculas.css';

export default function initListaMatriculas(container = document.querySelector('.lm-wrapper')) {
  if (!container) return;

  const buscador      = container.querySelector('#buscador');
  const sugerencias   = container.querySelector('#sugerenciasNombres');
  const filtroGrado   = container.querySelector('#filtro-grado');
  const filtroSeccion = container.querySelector('#filtro-seccion');
  const tablaBody     = container.querySelector('#tabla-alumnos tbody');

  let datosAlumnos = [];

  // === Valores estáticos de Grados y Secciones según BD ===
  const gradosEstaticos = [
    { id: 1, nombre: '3 años' },
    { id: 2, nombre: '4 años' },
    { id: 3, nombre: '5 años' },
    { id: 4, nombre: 'Primero' },
    { id: 5, nombre: 'Segundo' },
    { id: 6, nombre: 'Tercero' },
    { id: 7, nombre: 'Cuarto' },
    { id: 8, nombre: 'Quinto' },
    { id: 9, nombre: 'Sexto' }
  ];
  const seccionesEstaticas = [
    { id: 1, nombre: 'A' },
    { id: 2, nombre: 'B' },
    { id: 3, nombre: 'C' }
  ];

  // Población inicial de selects estáticos
  filtroGrado.innerHTML   = '<option value="">Todos los grados</option>';
  gradosEstaticos.forEach(g => {
    filtroGrado.insertAdjacentHTML(
      'beforeend',
      `<option value="${g.nombre}">${g.nombre}</option>`
    );
  });

  filtroSeccion.innerHTML = '<option value="">Todas las secciones</option>';
  seccionesEstaticas.forEach(s => {
    filtroSeccion.insertAdjacentHTML(
      'beforeend',
      `<option value="${s.nombre}">${s.nombre}</option>`
    );
  });

  // Vacía la tabla inicialmente
  tablaBody.innerHTML = '';

  // Traer datos de la BD vía endpoint JSON
  fetch('/alumnos/json')
    .then(res => res.json())
    .then(json => {
      datosAlumnos = json;
    })
    .catch(err => console.error('Error cargando alumnos:', err));

  // Renderizar filas
  const renderizarTabla = filas => {
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

  // Filtrar por grado y sección
  const obtenerFiltrados = () => {
    const g = filtroGrado.value;
    const s = filtroSeccion.value;
    return datosAlumnos.filter(al =>
      (!g || al.grado === g) &&
      (!s || al.seccion === s)
    );
  };

  // Al cambiar filtros
  const onFiltroCambio = () => {
    tablaBody.innerHTML = '';
    buscador.value = '';
    sugerencias.style.display = 'none';
    if (filtroGrado.value && filtroSeccion.value) {
      renderizarTabla(obtenerFiltrados());
    }
  };
  filtroGrado.addEventListener('change', onFiltroCambio);
  filtroSeccion.addEventListener('change', onFiltroCambio);

  // Sugerencias de búsqueda
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

  // Ocultar sugerencias al click fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      sugerencias.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initListaMatriculas());
