import '/resources/css/forms/asistencia/historialAsistencia.css';

export default function initHistorialAsistencia(container = document.querySelector('.ha-wrapper')) {
  if (!container) return;

  const mesInput     = container.querySelector('#mes');
  const gradoInput   = container.querySelector('#grado');
  const seccionInput = container.querySelector('#seccion');
  const nombreInput  = container.querySelector('#nombreAlumno');
  const suggestions  = container.querySelector('#suggestions');
  const tablaCont    = container.querySelector('#tablaResumen');

  // 1) Poner mes actual
  const hoy      = new Date();
  const yyyy     = hoy.getFullYear();
  const mm       = String(hoy.getMonth() + 1).padStart(2, '0');
  mesInput.value = `${yyyy}-${mm}`;

  // 2) Calcular solo lunes–viernes del mes actual
  const monthIdx = hoy.getMonth();
  const diasMes  = new Date(yyyy, monthIdx + 1, 0).getDate();
  const weekDays = [];
  for (let d = 1; d <= diasMes; d++) {
    const dia = new Date(yyyy, monthIdx, d).getDay();
    if (dia >= 1 && dia <= 5) weekDays.push(d);
  }

  // 3) Crear solo el header de la tabla
  function crearHeader() {
    let html = `<table><thead><tr><th>Alumno</th>`;
    for (const d of weekDays) {
      html += `<th style="width:25px;">${d}</th>`;
    }
    html += `</tr></thead><tbody></tbody></table>`;
    tablaCont.innerHTML = html;
  }
  crearHeader();

  // 4) Simula llamada a tu API
  async function obtenerAlumnos(grado, seccion) {
    const todos = [
      { id: 1, nombre: 'Ana Torres',  grado: '1', seccion: 'A' },
      { id: 2, nombre: 'Luis Pérez',   grado: '2', seccion: 'B' },
      { id: 3, nombre: 'María López',  grado: '1', seccion: 'A' },
      // ...
    ];
    return todos.filter(a => a.grado === grado && a.seccion === seccion);
  }

  let alumnosCache = [];

  // 5) Renderizar todas las filas según alumnosCache
  function renderAllRows() {
    const tbody = tablaCont.querySelector('tbody');
    tbody.innerHTML = '';

    if (alumnosCache.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${weekDays.length + 1}">No hay datos</td></tr>`;
      return;
    }

    for (const al of alumnosCache) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="nombre">${al.nombre}</td>`;
      for (let i = 0; i < weekDays.length; i++) {
        tr.innerHTML += `<td data-estado="">–</td>`;
      }
      tbody.appendChild(tr);
    }
  }

  // 6) Al cambiar grado o sección, recargar cache y mostrar todos
  async function cargarAlumnos() {
    const g = gradoInput.value.trim();
    const s = seccionInput.value.trim();
    if (!g || !s) {
      alumnosCache = [];
      suggestions.innerHTML = '';
      tablaCont.querySelector('tbody').innerHTML = '';
      return;
    }
    alumnosCache = await obtenerAlumnos(g, s);
    suggestions.innerHTML = '';
    renderAllRows();
  }
  gradoInput.addEventListener('change', cargarAlumnos);
  seccionInput.addEventListener('change', cargarAlumnos);

  // 7) Al escribir, solo mostrar sugerencias
  nombreInput.addEventListener('input', () => {
    const term = nombreInput.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!term) return;

    for (const a of alumnosCache) {
      if (a.nombre.toLowerCase().includes(term)) {
        const li = document.createElement('li');
        li.textContent = a.nombre;
        li.addEventListener('click', () => {
          nombreInput.value = a.nombre;
          suggestions.innerHTML = '';
          renderFila(a);
        });
        suggestions.appendChild(li);
      }
    }
  });

  // 8) Dibuja una única fila del alumno seleccionado
  function renderFila(al) {
    const tbody = tablaCont.querySelector('tbody');
    tbody.innerHTML = '';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="nombre">${al.nombre}</td>`;
    for (let i = 0; i < weekDays.length; i++) {
      tr.innerHTML += `<td data-estado="">–</td>`;
    }
    tbody.appendChild(tr);
  }

  // 9) Cerrar sugerencias al clicar fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      suggestions.innerHTML = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initHistorialAsistencia());
