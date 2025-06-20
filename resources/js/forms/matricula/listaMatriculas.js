// resources/js/forms/matricula/listaMatriculas.js

import '/resources/css/forms/matricula/listaMatriculas.css';
import {
  fetchGrados,
  fetchSecciones
} from '../utils/loadGradosSecciones.js';

export default async function initListaMatriculas(container = document.querySelector('.lm-wrapper')) {
  if (!container) return;

  const buscador      = container.querySelector('#buscador');
  const sugerencias   = container.querySelector('#sugerenciasNombres');
  const filtroGrado   = container.querySelector('#filtro-grado');
  const filtroSeccion = container.querySelector('#filtro-seccion');
  const tablaBody     = container.querySelector('#tabla-alumnos tbody');
  const guardarBtn    = container.querySelector('#guardar-btn');
  const mensajeOK     = container.querySelector('#mensaje-confirmacion');
  const csrfToken     = document.querySelector('meta[name="csrf-token"]').content;

  let datosAlumnosFull = [];
  let datosAlumnos = [];

  // Helper genérico para fetch JSON
  async function fetchJSON(url) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
    return res.ok ? res.json() : [];
  }

  // 1) Carga dinámica de Grados y Secciones
  try {
    const [gradosBD, seccionesBD] = await Promise.all([
      fetchGrados(),
      fetchSecciones()
    ]);
    // Poblar selects manteniendo value = nombre para filtrar por nombre
    filtroGrado.innerHTML = '<option value="">Todos los grados</option>';
    gradosBD.forEach(g => {
      filtroGrado.insertAdjacentHTML(
        'beforeend',
        `<option value="${g.nombre}">${g.nombre}</option>`
      );
    });
    filtroSeccion.innerHTML = '<option value="">Todas las secciones</option>';
    seccionesBD.forEach(s => {
      filtroSeccion.insertAdjacentHTML(
        'beforeend',
        `<option value="${s.nombre}">${s.nombre}</option>`
      );
    });
  } catch (err) {
    console.error('No se pudieron cargar grados/secciones:', err);
  }

  // 2) Carga inicial de todos los alumnos desde BD
  try {
    datosAlumnosFull = await fetchJSON('/alumnos/json');
  } catch (err) {
    console.error('Error cargando alumnos:', err);
  }

  // 3) Función para filtrar por grado y sección y renderizar
  function cargarAlumnosLocal() {
    const g = filtroGrado.value;
    const s = filtroSeccion.value;
    if (!g || !s) {
      tablaBody.innerHTML = '';
      datosAlumnos = [];
      return;
    }
    datosAlumnos = datosAlumnosFull.filter(al =>
      al.grado === g && al.seccion === s
    );
    renderizarTabla(datosAlumnos);
  }

  // 4) Renderizado de la tabla
  function renderizarTabla(filas) {
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
        </td>`;
      tablaBody.appendChild(tr);
    });
  }

  // 5) Eventos al cambiar grado o sección
  [filtroGrado, filtroSeccion].forEach(sel =>
    sel.addEventListener('change', () => {
      buscador.value = '';
      sugerencias.style.display = 'none';
      cargarAlumnosLocal();
    })
  );

  // 6) Autocompletar búsqueda desde el conjunto filtrado
  buscador.addEventListener('input', () => {
    const texto = buscador.value.trim().toLowerCase();
    if (!texto || datosAlumnos.length === 0) {
      sugerencias.style.display = 'none';
      return;
    }
    const list = datosAlumnos
      .filter(al => (`${al.nombres} ${al.apellidos}`).toLowerCase().includes(texto))
      .slice(0, 5);

    if (list.length) {
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

  // 7) Guardar cambios en BD
  guardarBtn.addEventListener('click', async () => {
    if (!(filtroGrado.value && filtroSeccion.value)) {
      alert('Seleccione grado y sección para guardar cambios.');
      return;
    }
    const updates = Array.from(tablaBody.querySelectorAll('tr')).map(tr => ({
      id:     tr.dataset.id,
      estado: tr.querySelector('.lm-estado-select').value
    }));

    try {
      const res = await fetch('/alumnos/estado', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ updates })
      });
      if (!res.ok) throw new Error('Error en servidor');
      await res.json();
      mensajeOK.style.display = 'block';
      setTimeout(() => mensajeOK.style.display = 'none', 3000);
    } catch (err) {
      console.error(err);
      alert('No se pudieron guardar los cambios.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initListaMatriculas());
