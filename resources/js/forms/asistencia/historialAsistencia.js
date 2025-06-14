// resources/js/forms/asistencia/historialAsistencia.js
import '/resources/css/forms/asistencia/historialAsistencia.css';

export default function initHistorialAsistencia(container = document.querySelector('.ha-wrapper')) {
  if (!container) return;

  // 1) Referencias al DOM
  const mesSelect     = container.querySelector('#mes');
  const gradoSelect   = container.querySelector('#grado');
  const seccionSelect = container.querySelector('#seccion');
  const nombreInput   = container.querySelector('#nombreAlumno');
  const suggestions   = container.querySelector('#suggestions');
  const tablaCont     = container.querySelector('#tablaResumen');

  // 2) Datos estáticos para los selects
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
  const mesesEstaticos = [
    { id: '01', nombre: 'Enero' },
    { id: '02', nombre: 'Febrero' },
    { id: '03', nombre: 'Marzo' },
    { id: '04', nombre: 'Abril' },
    { id: '05', nombre: 'Mayo' },
    { id: '06', nombre: 'Junio' },
    { id: '07', nombre: 'Julio' },
    { id: '08', nombre: 'Agosto' },
    { id: '09', nombre: 'Septiembre' },
    { id: '10', nombre: 'Octubre' },
    { id: '11', nombre: 'Noviembre' },
    { id: '12', nombre: 'Diciembre' }
  ];

  // 3) Variables de estado global
  let weekDays = [];
  let alumnosCache = [];
  let mapAsis = {};

  // 4) Helper para poblar un <select>
  function poblarSelect(selectEl, datos) {
    selectEl.innerHTML = '<option value="">--Selecciona--</option>';
    datos.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.nombre;
      selectEl.appendChild(opt);
    });
  }

  // 5) Poblamos los selects al inicio
  poblarSelect(gradoSelect, gradosEstaticos);
  poblarSelect(seccionSelect, seccionesEstaticas);
  poblarSelect(mesSelect, mesesEstaticos);

  // 6) Calcula días hábiles (lun–vie) de un mes
  function getWeekDays(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const result = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const wd = new Date(year, month - 1, d).getDay();
      if (wd >= 1 && wd <= 5) result.push(d);
    }
    return result;
  }

  // 7) Inyecta el header de la tabla (con <tbody>)
  function crearHeader() {
    const year = new Date().getFullYear();
    const month = parseInt(mesSelect.value, 10);
    weekDays = getWeekDays(year, month);

    let html = `<table><thead><tr><th>Alumno</th>`;
    weekDays.forEach(d => {
      html += `<th style="width:25px;">${d}</th>`;
    });
    html += `</tr></thead><tbody></tbody></table>`;
    tablaCont.innerHTML = html;
  }

  // 8) Trae alumnos desde la BD (Laravel) según grado_id y seccion_id
  async function obtenerAlumnosDesdeBD(gradoId, seccionId) {
    const res = await fetch('/alumnos/filtrar', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ grado_id: +gradoId, seccion_id: +seccionId })
    });
    if (!res.ok) {
      console.error('Error cargando alumnos:', res.statusText);
      return [];
    }
    const data = await res.json(); // [{ id, nombre_completo }]
    return data.map(a => ({ id: a.id, nombre: a.nombre_completo }));
  }

  // 9) Trae asistencias desde la BD (Laravel) según grado, sección y mes
  async function obtenerAsistencias(gradoId, seccionId, mes) {
    const year = new Date().getFullYear();
    const res = await fetch(`/asistencia-alumnos/filtrar?grado_id=${gradoId}&seccion_id=${seccionId}&mes=${year}-${mes}`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      console.error('Error cargando asistencias:', res.statusText);
      return [];
    }
    return await res.json(); // [{ alumno_id, fecha, estado }, ...]
  }

  // 10) Función principal: limpia y vuelve a construir la tabla
  async function cargarAlumnos() {
    // Limpia todo
    tablaCont.innerHTML = '';

    const gradoId   = gradoSelect.value;
    const seccionId = seccionSelect.value;
    const mesVal    = mesSelect.value;
    if (!gradoId || !seccionId || !mesVal) return;

    // Reconstruye header con el mes actual
    crearHeader();

    // Obtiene alumnos y luego asistencias
    alumnosCache = await obtenerAlumnosDesdeBD(gradoId, seccionId);
    const asistencias = await obtenerAsistencias(gradoId, seccionId, mesVal);

    // Reconstruye el mapa de asistencias
    mapAsis = {};
    asistencias.forEach(a => {
      const day = parseInt(a.fecha.split('-')[2], 10);
      if (!mapAsis[a.alumno_id]) mapAsis[a.alumno_id] = {};
      mapAsis[a.alumno_id][day] = a.estado;
    });

    // Poblamos filas
    const tbodyEl = tablaCont.querySelector('tbody');
    if (alumnosCache.length === 0) {
      tbodyEl.innerHTML = `<tr><td colspan="${weekDays.length + 1}">No hay alumnos</td></tr>`;
      return;
    }
    alumnosCache.forEach(al => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${al.nombre}</td>`;
      weekDays.forEach(d => {
        const estado = (mapAsis[al.id] && mapAsis[al.id][d]) || 'N';
        tr.innerHTML += `<td data-estado="${estado}">${estado}</td>`;
      });
      tbodyEl.appendChild(tr);
    });
  }

  // 11) Listeners: recargar al cambiar filtros
  gradoSelect.addEventListener('change', cargarAlumnos);
  seccionSelect.addEventListener('change', cargarAlumnos);
  mesSelect.addEventListener('change', cargarAlumnos);

  // 12) Autocomplete: filtrar por nombre
  nombreInput.addEventListener('input', () => {
    const term = nombreInput.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!term) return;
    alumnosCache
      .filter(a => a.nombre.toLowerCase().includes(term))
      .forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.nombre;
        li.onclick = () => {
          nombreInput.value = a.nombre;
          suggestions.innerHTML = '';
          const tbodyEl = tablaCont.querySelector('tbody');
          tbodyEl.innerHTML = '';
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${a.nombre}</td>`;
          weekDays.forEach(d => {
            const est = (mapAsis[a.id] && mapAsis[a.id][d]) || 'N';
            tr.innerHTML += `<td data-estado="${est}">${est}</td>`;
          });
          tbodyEl.appendChild(tr);
        };
        suggestions.appendChild(li);
      });
  });

  // 13) Cerrar sugerencias al clicar fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) suggestions.innerHTML = '';
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => initHistorialAsistencia());
