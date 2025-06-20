import axios from 'axios';
import '/resources/css/forms/pagos/historialPagos.css';
import { initGradosSecciones, poblarSelect } from '../utils/loadGradosSecciones.js';

export default async function initHistorialPagos(container = document.querySelector('.hp-wrapper')) {
  if (!container) return;

  // Configura CSRF para Axios
  axios.defaults.headers.common['X-CSRF-TOKEN'] =
    document.querySelector('meta[name="csrf-token"]').content;

  // Referencias al DOM
  const gradoSelect    = container.querySelector('#gradoHistorial');
  const seccionSelect  = container.querySelector('#seccionHistorial');
  const mesSelect      = container.querySelector('#mesHistorial');
  const buscadorInput  = container.querySelector('#buscadorAlumno');
  const sugerenciasDiv = container.querySelector('#sugerenciasAlumnos');
  const tablaBody      = container.querySelector('#tablaPagos tbody');
  const btnDeudores    = container.querySelector('#btnDeudores');

  let pagosData   = [];
  let alumnosData = [];
  let resultados  = [];

  // 1) Carga dinámica de grados y secciones desde la BD
  try {
    await initGradosSecciones(gradoSelect, seccionSelect, 'Grado', 'Sección');
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    gradoSelect.innerHTML   = '<option value="">No se cargaron grados</option>';
    seccionSelect.innerHTML = '<option value="">No se cargaron secciones</option>';
  }

  // 2) Población de meses (estático)
  const mesesEstaticos = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }
  ];
  poblarSelect(mesSelect, mesesEstaticos, 'Seleccione mes');

  // 3) Traer datos iniciales de la API
  async function cargarDatosBD() {
    try {
      const [rPagos, rAlumnos] = await Promise.all([
        axios.get('/pagos'),
        axios.get('/alumnos/json')
      ]);
      pagosData = rPagos.data;
      alumnosData = rAlumnos.data.map(a => ({
        id: a.id,
        grado_id: a.grado_id,
        seccion_id: a.seccion_id,
        nombre_completo: `${a.nombres} ${a.apellidos}`
      }));
    } catch(err) {
      console.error('Error cargando pagos o alumnos:', err);
    }
  }

  // 4) Renderizar la tabla
  function mostrarTabla(lista) {
    tablaBody.innerHTML = '';
    if (!lista.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4">No hay pagos para esta combinación.</td>`;
      tablaBody.appendChild(tr);
      return;
    }
    lista.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.alumno}</td>
        <td>${r.mes}</td>
        <td>${r.fecha_pago || ''}</td>
        <td>${(r.monto||0).toFixed(2)}</td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // 5) Actualizar resultados según filtros
  function actualizarResultados() {
    const g = gradoSelect.value;
    const s = seccionSelect.value;
    const m = mesSelect.value;
    if (!g || !s || !m) {
      resultados = [];
      return mostrarTabla([]);
    }
    resultados = alumnosData
      .filter(a => String(a.grado_id) === g && String(a.seccion_id) === s)
      .map(a => {
        const pago = pagosData.find(p =>
          String(p.grado_id)   === g &&
          String(p.seccion_id) === s &&
          p.alumno.id          == a.id &&
          String(p.mes)        === m
        );
        return {
          alumno:     a.nombre_completo,
          mes:        mesesEstaticos[m-1].nombre,
          fecha_pago: pago?.fecha_pago,
          monto:      pago ? Number(pago.monto) : 0
        };
      });
    mostrarTabla(resultados);
  }

  // 6) Mostrar solo deudores
  function mostrarDeudores() {
    mostrarTabla(resultados.filter(r => r.monto === 0));
  }

  // 7) Autocompletar buscador
  function actualizarSugerencias() {
    const term = buscadorInput.value.trim().toLowerCase();
    sugerenciasDiv.innerHTML = '';
    if (!term) return;
    const nombres = [...new Set(
      resultados
        .filter(r => r.alumno.toLowerCase().includes(term))
        .map(r => r.alumno)
    )];
    nombres.forEach(n => {
      const div = document.createElement('div');
      div.textContent = n;
      div.classList.add('hp-sugerencia-item');
      div.addEventListener('click', () => {
        buscadorInput.value = n;
        sugerenciasDiv.innerHTML = '';
        mostrarTabla(resultados.filter(r => r.alumno === n));
      });
      sugerenciasDiv.appendChild(div);
    });
  }

  // 8) Listeners
  gradoSelect  .addEventListener('change', actualizarResultados);
  seccionSelect.addEventListener('change', actualizarResultados);
  mesSelect    .addEventListener('change', actualizarResultados);
  btnDeudores  .addEventListener('click', mostrarDeudores);
  buscadorInput.addEventListener('input', actualizarSugerencias);
  buscadorInput.addEventListener('blur', () => {
    setTimeout(() => sugerenciasDiv.innerHTML = '', 150);
  });

  // 9) Inicialización
  await cargarDatosBD();
  mostrarTabla([]);
}

document.addEventListener('DOMContentLoaded', () => initHistorialPagos());
