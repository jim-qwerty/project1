import axios from 'axios';
import '/resources/css/forms/pagos/pagoMensual.css';
import { initGradosSecciones } from '../utils/loadGradosSecciones.js';

export default async function initPagoMensual(container = document.querySelector('.pm-wrapper')) {
  if (!container) return;
  console.log("Inicializando Pago Mensual");

  // Configurar CSRF para Axios
  axios.defaults.headers.common['X-CSRF-TOKEN'] =
    document.querySelector('meta[name="csrf-token"]').content;

  // Referencias al DOM
  const gradoSelect       = container.querySelector('#gradoSelect');
  const seccionSelect     = container.querySelector('#seccionSelect');
  const mesSelect         = container.querySelector('#mesSelect');
  const fechaInput        = container.querySelector('#fechaSistema');
  const alumnoInput       = container.querySelector('#alumnoInput');
  const listaCoincidencias= container.querySelector('#listaCoincidencias');
  const montoInput        = container.querySelector('#montoPago');
  const metodoSelect      = container.querySelector('#metodoPago');
  const observacionInput  = container.querySelector('#observaciones');
  const mensajePago       = container.querySelector('#mensajeConfirmacion');
  const form              = container.querySelector('#formularioPagos');

  let alumnos = [];

  // === 1) Carga dinámica de grados y secciones ===
  try {
    await initGradosSecciones(gradoSelect, seccionSelect);
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    gradoSelect.innerHTML   = '<option value="">Error cargando grados</option>';
    seccionSelect.innerHTML = '<option value="">Error cargando secciones</option>';
  }

  // === 2) Poblar meses estáticos ===
  const mesesEstaticos = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];
  mesSelect.innerHTML = '<option value="">Seleccione mes</option>';
  mesesEstaticos.forEach((m, i) => {
    mesSelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${i+1}">${m}</option>`
    );
  });

  // === 3) Cargar alumnos del servidor según grado y sección ===
  async function cargarAlumnos() {
    const gradoId   = gradoSelect.value;
    const seccionId = seccionSelect.value;
    alumnoInput.value = '';
    delete alumnoInput.dataset.id;
    listaCoincidencias.innerHTML = '';
    alumnos = [];

    if (!gradoId || !seccionId) return;

    try {
      const resp = await axios.get('/alumnos/filtrar', {
        params: { grado_id: gradoId, seccion_id: seccionId }
      });
      alumnos = resp.data; // [{id, nombre_completo}, ...]
    } catch (err) {
      console.error('Error cargando alumnos:', err);
      alumnos = [];
    }
  }

  // === 4) Autocompletado ===
  function actualizarListaCoincidencias() {
    const texto = alumnoInput.value.trim().toLowerCase();
    listaCoincidencias.innerHTML = '';
    delete alumnoInput.dataset.id;
    if (!texto) return;

    alumnos
      .filter(a => a.nombre_completo.toLowerCase().includes(texto))
      .forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.nombre_completo;
        li.dataset.id  = a.id;
        li.addEventListener('click', () => {
          alumnoInput.value = a.nombre_completo;
          alumnoInput.dataset.id = a.id;
          listaCoincidencias.innerHTML = '';
        });
        listaCoincidencias.appendChild(li);
      });
  }

  // === 5) Listeners de carga y autocompletado ===
  gradoSelect.addEventListener('change', cargarAlumnos);
  seccionSelect.addEventListener('change', cargarAlumnos);
  alumnoInput.addEventListener('input', actualizarListaCoincidencias);

  // === 6) Envío del formulario ===
  form.addEventListener('submit', async e => {
    e.preventDefault();
    mensajePago.textContent = '';

    const alumnoId = alumnoInput.dataset.id;
    if (!alumnoId) {
      mensajePago.textContent = '❌ Debes seleccionar un alumno válido.';
      return;
    }

    const mesInt = parseInt(mesSelect.value, 10);
    const fecha  = new Date(fechaInput.value);
    const año    = fecha.getFullYear();

    const payload = {
      alumno_id:   alumnoId,
      grado_id:    parseInt(gradoSelect.value, 10),
      seccion_id:  parseInt(seccionSelect.value, 10),
      mes:         mesInt,
      año,          
      fecha_pago:  fechaInput.value,
      monto:       parseFloat(montoInput.value),
      metodo_pago: metodoSelect.value,
      observacion: observacionInput.value.trim(),
    };

    try {
      const resp = await axios.post('/pagos', payload);
      mensajePago.textContent = `✅ Pago registrado (ID ${resp.data.id})`;
      form.reset();
      alumnos = [];
      listaCoincidencias.innerHTML = '';
    } catch (err) {
      if (err.response?.status === 422) {
        mensajePago.innerHTML = Object.values(err.response.data.errors)
          .flat()
          .map(msg => `❌ ${msg}`)
          .join('<br>');
      } else {
        console.error('Error registrando pago:', err);
        mensajePago.textContent = '❌ Error al registrar el pago.';
      }
    }
  });

  // === 7) Ocultar sugerencias al hacer clic fuera ===
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      listaCoincidencias.innerHTML = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initPagoMensual());
