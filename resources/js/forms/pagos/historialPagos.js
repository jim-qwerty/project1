// resources/js/forms/pagos/historialPagos.js
import axios from 'axios';
import '/resources/css/forms/pagos/historialPagos.css';

export default function initHistorialPagos(container = document.querySelector('.hp-wrapper')) {
  if (!container) return;
  axios.defaults.headers.common['X-CSRF-TOKEN'] =
    document.querySelector('meta[name="csrf-token"]').content;

  // 1) Arrays para poblar selects
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
  const mesesEstaticos = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  // 2) Referencias al DOM
  const gradoSelect      = container.querySelector('#gradoHistorial');
  const seccionSelect    = container.querySelector('#seccionHistorial');
  const mesSelect        = container.querySelector('#mesHistorial');
  const buscadorInput    = container.querySelector('#buscadorAlumno');
  const sugerenciasDiv   = container.querySelector('#sugerenciasAlumnos');
  const tablaBody        = container.querySelector('#tablaPagos tbody');
  const btnDeudores      = container.querySelector('#btnDeudores');

  // 3) Datos traídos de la BD
  let pagosData   = [];
  let alumnosData = [];
  let resultados  = [];

  // 4) Función para poblar selects
  function poblarSelect(selectEl, items, textKey='nombre', valueKey='id', placeholder='') {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach(i => {
      const opt = document.createElement('option');
      opt.value       = i[valueKey];
      opt.textContent = i[textKey];
      selectEl.appendChild(opt);
    });
  }

  poblarSelect(gradoSelect, gradosEstaticos, 'nombre','id','Seleccione grado');
  poblarSelect(seccionSelect, seccionesEstaticas, 'nombre','id','Seleccione sección');
  mesSelect.innerHTML = `<option value="">Seleccione mes</option>`;
  mesesEstaticos.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    mesSelect.appendChild(opt);
  });

  // 5) Traer datos iniciales de la API
  async function cargarDatosBD() {
    try {
      const [rPagos, rAlumnos] = await Promise.all([
        axios.get('/pagos'),
        axios.get('/alumnos/json')
      ]);
      pagosData   = rPagos.data;
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

  // 6) Renderizar la tabla
  function mostrarTabla(lista) {
    tablaBody.innerHTML = '';
    if (!lista.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4">No hay pagos registrados para esta combinación.</td>`;
      tablaBody.appendChild(tr);
      return;
    }
    lista.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.alumno}</td>
        <td>${r.mes}</td>
        <td>${r.fecha_pago}</td>
        <td>${r.monto.toFixed(2)}</td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // 7) Actualizar resultados según filtros
  function actualizarResultados() {
    const g       = gradoSelect.value;
    const s       = seccionSelect.value;
    const mesText = mesSelect.value;
    if (!g || !s || !mesText) {
      resultados = [];
      return mostrarTabla([]);
    }

    // Convertir mesText a entero 1-12
    const mesInt = mesesEstaticos.indexOf(mesText) + 1;

    // Filtrar alumnos por grado/sección
    const alumnosFiltro = alumnosData.filter(a =>
      String(a.grado_id) === String(g) &&
      String(a.seccion_id) === String(s)
    );

    resultados = alumnosFiltro.map(a => {
      const pago = pagosData.find(p =>
        String(p.grado_id)   === String(g) &&
        String(p.seccion_id) === String(s) &&
        p.alumno.id          == a.id &&
        p.mes                === mesInt
      );
      return {
        alumno:     a.nombre_completo,
        mes:        mesText,
        fecha_pago: pago ? pago.fecha_pago : '',
        monto:      pago ? Number(pago.monto)      : 0   // <-- convertimos a número
      };
    });

    mostrarTabla(resultados);
  }

  // 8) Mostrar solo deudores
  function mostrarDeudores() {
    mostrarTabla(resultados.filter(r => r.monto === 0));
  }

  // 9) Autocompletar buscador
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
        mostrarTabla(
          resultados.filter(r =>
            r.alumno.toLowerCase() === n.toLowerCase()
          )
        );
      });
      sugerenciasDiv.appendChild(div);
    });
  }

  // 10) Listeners
  gradoSelect  .addEventListener('change', actualizarResultados);
  seccionSelect.addEventListener('change', actualizarResultados);
  mesSelect    .addEventListener('change', actualizarResultados);
  btnDeudores  .addEventListener('click', mostrarDeudores);
  buscadorInput.addEventListener('input', actualizarSugerencias);
  buscadorInput.addEventListener('blur', () => {
    setTimeout(() => sugerenciasDiv.innerHTML = '', 150);
  });

  // 11) Inicialización
  (async () => {
    await cargarDatosBD();
    mostrarTabla([]);  // tabla vacía al inicio
  })();
}

document.addEventListener('DOMContentLoaded', () => initHistorialPagos());
