import axios from 'axios';
import '/resources/css/forms/pagos/historialPagos.css';
import { initGradosSecciones, poblarSelect } from '../utils/loadGradosSecciones.js';

export default async function initHistorialPagos(container = document.querySelector('.hp-wrapper')) {
  if (!container) return;

  axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;

  const gradoSelect   = container.querySelector('#gradoHistorial');
  const seccionSelect = container.querySelector('#seccionHistorial');
  const mesSelect     = container.querySelector('#mesHistorial');
  const buscadorInput = container.querySelector('#buscadorAlumno');
  const sugerenciasDiv= container.querySelector('#sugerenciasAlumnos');
  const tablaBody     = container.querySelector('#tablaPagos tbody');
  const btnToggle     = container.querySelector('#btnDeudores');

  let alumnosData = [];
  let pagos = [];
  let deudores = [];
  let isDeudoresMode = false;

  // 1) Inicializar selects de grado y sección
  await initGradosSecciones(gradoSelect, seccionSelect);

  // 2) Cargar alumnos una sola vez
  await loadAlumnos();

  // 3) Meses
  const meses = [
    { id:1,nombre:'Enero' },{ id:2,nombre:'Febrero' },{ id:3,nombre:'Marzo' },
    { id:4,nombre:'Abril' },{ id:5,nombre:'Mayo' },{ id:6,nombre:'Junio' },
    { id:7,nombre:'Julio' },{ id:8,nombre:'Agosto' },{ id:9,nombre:'Septiembre' },
    { id:10,nombre:'Octubre' },{ id:11,nombre:'Noviembre' },{ id:12,nombre:'Diciembre' }
  ];
  poblarSelect(mesSelect, meses, 'Seleccione mes');

  // Funciones internas
  async function loadAlumnos() {
    try {
      const { data } = await axios.get('/alumnos/json');
      alumnosData = data.map(a => ({
        id: a.id,
        nombre: `${a.nombres} ${a.apellidos}`,
        grado_id: Number(a.grado_id),
        seccion_id: Number(a.seccion_id)
      }));
      console.log('Alumnos cargados:', alumnosData);
    } catch (err) {
      console.error('Error cargando alumnos:', err);
    }
  }

  function renderTabla(items) {
    tablaBody.innerHTML = '';
    if (!items.length) {
      tablaBody.innerHTML = '<tr><td colspan="4">No hay registros para esta combinación.</td></tr>';
      return;
    }
    items.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.alumno}</td>
        <td>${r.mes}</td>
        <td>${r.fecha_pago}</td>
        <td>${r.monto}</td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  async function fetchYMostrarPagos() {
    const grado   = gradoSelect.value;
    const seccion = seccionSelect.value;
    const mes     = mesSelect.value;
    if (!grado || !seccion || !mes) return renderTabla([]);

    try {
      const { data } = await axios.get('/pagos/filtrar', { params: { grado_id: grado, seccion_id: seccion, mes } });
      pagos = data.map(p => ({ alumno: p.alumno, mes: meses.find(m=>m.id==p.mes).nombre, fecha_pago: p.fecha_pago||'-', monto: Number(p.monto).toFixed(2) }));
      renderTabla(pagos);
    } catch (err) {
      console.error('Error cargando pagos:', err);
      renderTabla([]);
    }
  }

  async function fetchDeudores() {
    const grado   = gradoSelect.value;
    const seccion = seccionSelect.value;
    const mes     = mesSelect.value;
    if (!grado || !seccion || !mes) return renderTabla([]);

    try {
      const { data } = await axios.get('/pagos/deudores', { params: { grado_id: grado, seccion_id: seccion, mes } });
      deudores = data.map(d => ({ alumno: d.alumno, mes: meses.find(m=>m.id==mes).nombre, fecha_pago: '-', monto: '-' }));
      renderTabla(deudores);
    } catch (err) {
      console.error('Error cargando deudores:', err);
      renderTabla([]);
    }
  }

  function updateSuggestions() {
    const term = buscadorInput.value.trim().toLowerCase();
    sugerenciasDiv.innerHTML = '';
    if (!term) return;

    const grado   = Number(gradoSelect.value);
    const seccion = Number(seccionSelect.value);
    if (!grado || !seccion) return;

    const source = isDeudoresMode ? deudores : pagos;
    // Sugerencias de alumnos de la vista actual
    const list = source
      .filter(item => item.alumno.toLowerCase().includes(term))
      .map(item => item.alumno);

    new Set(list).forEach(nombre => {
      const div = document.createElement('div');
      div.textContent = nombre;
      div.classList.add('hp-sugerencia-item');
      div.addEventListener('click', () => { buscadorInput.value = nombre; sugerenciasDiv.innerHTML=''; renderTabla([source.find(i=>i.alumno===nombre)]); });
      sugerenciasDiv.appendChild(div);
    });
  }

  // Eventos
  btnToggle.addEventListener('click', async () => {
    isDeudoresMode = !isDeudoresMode;
    btnToggle.textContent = isDeudoresMode ? 'Mostrar pagos' : 'Mostrar solo deudores';
    buscadorInput.value = '';
    sugerenciasDiv.innerHTML = '';
    isDeudoresMode ? await fetchDeudores() : await fetchYMostrarPagos();
  });

  gradoSelect.addEventListener('change', async () => { buscadorInput.value=''; sugerenciasDiv.innerHTML=''; await fetchYMostrarPagos(); });
  seccionSelect.addEventListener('change', async () => { buscadorInput.value=''; sugerenciasDiv.innerHTML=''; await fetchYMostrarPagos(); });
  mesSelect.addEventListener('change', async () => { buscadorInput.value=''; sugerenciasDiv.innerHTML=''; await fetchYMostrarPagos(); });

  buscadorInput.addEventListener('input', updateSuggestions);
  buscadorInput.addEventListener('blur', () => setTimeout(() => sugerenciasDiv.innerHTML = '', 150));

  // Arranque inicial
  await fetchYMostrarPagos();
}

document.addEventListener('DOMContentLoaded', () => initHistorialPagos());
