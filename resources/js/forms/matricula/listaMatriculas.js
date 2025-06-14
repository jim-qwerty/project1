// resources/js/forms/matricula/listaMatriculas.js

import '/resources/css/forms/matricula/listaMatriculas.css';

export default function initListaMatriculas(container = document.querySelector('.lm-wrapper')) {
  if (!container) return;

  const buscador      = container.querySelector('#buscador');
  const sugerencias   = container.querySelector('#sugerenciasNombres');
  const filtroGrado   = container.querySelector('#filtro-grado');
  const filtroSeccion = container.querySelector('#filtro-seccion');
  const tablaBody     = container.querySelector('#tabla-alumnos tbody');
  const guardarBtn    = container.querySelector('#guardar-btn');
  const mensajeOK     = container.querySelector('#mensaje-confirmacion');
  const csrfToken     = document.querySelector('meta[name="csrf-token"]').content;

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
    { id: 2, nombre: 'B' }
  ];

  // Población inicial de selects estáticos
  filtroGrado.innerHTML = '<option value="">Todos los grados</option>';
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

  // Función para renderizar filas
  const renderizarTabla = filas => {
    tablaBody.innerHTML = '';
    filas.forEach(al => {
      const tr = document.createElement('tr');
      tr.dataset.id = al.id;
      tr.innerHTML = `
        <td>${al.nombres}</td>
        <td>${al.apellidos}</td>
        <td>${al.grado}</td>
        <td>${al.seccion}</td>
        <td>
          <select class="lm-estado-select">
            <option ${al.estado === 'Matriculado' ? 'selected' : ''}>Matriculado</option>
            <option ${al.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
            <option ${al.estado === 'Retirado' ? 'selected' : ''}>Retirado</option>
          </select>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  };

  // Filtrar datos en memoria
  const obtenerFiltrados = () => {
    const g = filtroGrado.value;
    const s = filtroSeccion.value;
    return datosAlumnos.filter(al =>
      (!g || al.grado === g) &&
      (!s || al.seccion === s)
    );
  };

  // Vacía la tabla
  const limpiarTabla = () => {
    tablaBody.innerHTML = '';
  };

  // Inicial: trae datos, pero no renderiza hasta que ambos selects tengan valor
  fetch('/alumnos/json')
    .then(res => res.json())
    .then(json => {
      datosAlumnos = json;
      // no renderizar aquí
    })
    .catch(err => console.error('Error cargando alumnos:', err));

  // Cuando cambian filtros
  const onFiltroCambio = () => {
    buscador.value = '';
    sugerencias.style.display = 'none';
    if (filtroGrado.value && filtroSeccion.value) {
      // si ambos seleccionados, mostrar
      renderizarTabla(obtenerFiltrados());
    } else {
      // si falta uno, limpiar
      limpiarTabla();
    }
  };
  filtroGrado.addEventListener('change', onFiltroCambio);
  filtroSeccion.addEventListener('change', onFiltroCambio);

  // Sugerencias de búsqueda (solo tiene efecto si ya hay filas mostradas)
  buscador.addEventListener('input', () => {
    const texto = buscador.value.trim().toLowerCase();
    const filtrados = obtenerFiltrados();
    const list = filtrados
      .filter(al => (`${al.nombres} ${al.apellidos}`).toLowerCase().includes(texto))
      .slice(0, 5);

    if (texto && list.length && filtroGrado.value && filtroSeccion.value) {
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

  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      sugerencias.style.display = 'none';
    }
  });

  // Guardar cambios en BD
  guardarBtn.addEventListener('click', () => {
    // solo permitir guardar si ambos filtros están seleccionados
    if (!(filtroGrado.value && filtroSeccion.value)) {
      alert('Seleccione grado y sección para guardar cambios.');
      return;
    }

    const updates = Array.from(tablaBody.querySelectorAll('tr')).map(tr => ({
      id:     tr.dataset.id,
      estado: tr.querySelector('.lm-estado-select').value
    }));

    fetch('/alumnos/estado', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({ updates })
    })
    .then(res => {
      if (!res.ok) throw new Error('Error en servidor');
      return res.json();
    })
    .then(() => {
      mensajeOK.style.display = 'block';
      setTimeout(() => mensajeOK.style.display = 'none', 3000);
    })
    .catch(err => {
      console.error(err);
      alert('No se pudieron guardar los cambios.');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => initListaMatriculas());
