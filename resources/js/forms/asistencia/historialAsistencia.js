import '/resources/css/forms/asistencia/historialAsistencia.css';
import { initGradosSecciones, poblarSelect } from '../utils/loadGradosSecciones.js';

export default async function initHistorialAsistencia(container = document.querySelector('.ha-wrapper')) {
  if (!container) return;

  // 1) Referencias al DOM
  const mesSelect     = container.querySelector('#mes');
  const gradoSelect   = container.querySelector('#grado');
  const seccionSelect = container.querySelector('#seccion');
  const nombreInput   = container.querySelector('#nombreAlumno');
  const suggestions   = container.querySelector('#suggestions');
  const tablaCont     = container.querySelector('#tablaResumen');

  // 2) Carga dinámica de grado y sección desde BD
  try {
    await initGradosSecciones(gradoSelect, seccionSelect);
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    gradoSelect.innerHTML   = '<option value="">Error cargando grados</option>';
    seccionSelect.innerHTML = '<option value="">Error cargando secciones</option>';
  }

  // 3) Poblamos meses estático
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
  poblarSelect(mesSelect, mesesEstaticos, '--Selecciona mes--');

  // 4) Calcula días hábiles (lun–vie) de un mes
  function getWeekDays(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const result = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const wd = new Date(year, month - 1, d).getDay();
      if (wd >= 1 && wd <= 5) result.push(d);
    }
    return result;
  }

  // 5) Inyecta el header de la tabla
  function crearHeader() {
    const year  = new Date().getFullYear();
    const month = parseInt(mesSelect.value, 10);
    weekDays     = getWeekDays(year, month);

    let html = `<table><thead><tr><th>Alumno</th>`;
    weekDays.forEach(d => html += `<th style=\"width:25px;\">${d}</th>`);
    html += `</tr></thead><tbody></tbody></table>`;
    tablaCont.innerHTML = html;
  }

  // 6) Funciones para obtener datos
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
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(a => ({ id: a.id, nombre: a.nombre_completo }));
  }

  async function obtenerAsistencias(gradoId, seccionId, mes) {
    const year = new Date().getFullYear();
    const res  = await fetch(
      `/asistencia-alumnos/filtrar?grado_id=${gradoId}&seccion_id=${seccionId}&mes=${year}-${mes}`,
      { credentials: 'same-origin', headers: { 'Accept': 'application/json' } }
    );
    return res.ok ? res.json() : [];
  }

  // 7) Construye la tabla con datos de alumnos y asistencias
  let weekDays = [];
  let alumnosCache = [];
  let mapAsis = {};

  async function cargarAlumnos() {
    tablaCont.innerHTML = '';
    const gradoId   = gradoSelect.value;
    const seccionId = seccionSelect.value;
    const mesVal    = mesSelect.value;
    if (!gradoId || !seccionId || !mesVal) return;

    crearHeader();
    alumnosCache = await obtenerAlumnosDesdeBD(gradoId, seccionId);
    const asistencias = await obtenerAsistencias(gradoId, seccionId, mesVal);

    mapAsis = {};
    asistencias.forEach(a => {
      const day = +a.fecha.split('-')[2];
      mapAsis[a.alumno_id] ||= {};
      mapAsis[a.alumno_id][day] = a.estado;
    });

    const tbodyEl = tablaCont.querySelector('tbody');
    if (alumnosCache.length === 0) {
      tbodyEl.innerHTML = `<tr><td colspan=\"${weekDays.length + 1}\">No hay alumnos</td></tr>`;
      return;
    }
    alumnosCache.forEach(al => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${al.nombre}</td>`;
      weekDays.forEach(d => {
        const estado = mapAsis[al.id]?.[d] || 'N';
        tr.innerHTML += `<td data-estado=\"${estado}\">${estado}</td>`;
      });
      tbodyEl.appendChild(tr);
    });
  }

  // 8) Listeners
  gradoSelect.addEventListener('change', cargarAlumnos);
  seccionSelect.addEventListener('change', cargarAlumnos);
  mesSelect.addEventListener('change', cargarAlumnos);

  // 9) Autocomplete por nombre
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
            const est = mapAsis[a.id]?.[d] || 'N';
            tr.innerHTML += `<td data-estado=\"${est}\">${est}</td>`;
          });
          tbodyEl.appendChild(tr);
        };
        suggestions.appendChild(li);
      });
  });

  // 10) Cerrar sugerencias al clicar fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) suggestions.innerHTML = '';
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => initHistorialAsistencia());
