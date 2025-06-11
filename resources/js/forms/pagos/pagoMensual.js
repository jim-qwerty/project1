import axios from 'axios';
import '/resources/css/forms/pagos/pagoMensual.css';

export default function initPagoMensual(container = document.querySelector('.pm-wrapper')) {
  if (!container) return;
  console.log("Inicializando Pago Mensual");

  // Configurar CSRF para Axios
  axios.defaults.headers.common['X-CSRF-TOKEN'] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');

  // Valores estáticos de grados y secciones (según BD)
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

  // Referencias al DOM
  const gradoSelect        = container.querySelector('#gradoSelect');
  const seccionSelect      = container.querySelector('#seccionSelect');
  const mesSelect          = container.querySelector('#mesSelect');
  const fechaInput         = container.querySelector('#fechaSistema');
  const alumnoInput        = container.querySelector('#alumnoInput');
  const listaCoincidencias = container.querySelector('#listaCoincidencias');
  const montoInput         = container.querySelector('#montoPago');
  const metodoSelect       = container.querySelector('#metodoPago');
  const observacionInput   = container.querySelector('#observaciones');
  const mensajePago        = container.querySelector('#mensajeConfirmacion');
  const form               = container.querySelector('#formularioPagos');

  let alumnos = [];

  // Poblar select de grados
  gradosEstaticos.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = g.nombre;
    gradoSelect.appendChild(opt);
  });

  // Poblar select de secciones
  seccionesEstaticas.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.nombre;
    seccionSelect.appendChild(opt);
  });

  // Cargar alumnos del servidor según grado y sección
  const cargarAlumnos = async () => {
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
  };

  // Mostrar sugerencias de autocompletado
  const actualizarListaCoincidencias = () => {
    const texto = alumnoInput.value.trim().toLowerCase();
    listaCoincidencias.innerHTML = '';
    delete alumnoInput.dataset.id;
    if (!texto) return;

    alumnos
      .filter(a => a.nombre_completo.toLowerCase().includes(texto))
      .forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.nombre_completo;
        li.dataset.id = a.id;
        li.addEventListener('click', () => {
          alumnoInput.value = a.nombre_completo;
          alumnoInput.dataset.id = a.id;
          listaCoincidencias.innerHTML = '';
        });
        listaCoincidencias.appendChild(li);
      });
  };

  // Listeners para cargar y autocompletar alumnos
  gradoSelect.addEventListener('change', cargarAlumnos);
  seccionSelect.addEventListener('change', cargarAlumnos);
  alumnoInput.addEventListener('input', actualizarListaCoincidencias);

  // Envío del formulario vía AJAX con manejo de errores de validación
  form.addEventListener('submit', async e => {
    e.preventDefault();
    mensajePago.textContent = '';

    const alumnoId = alumnoInput.dataset.id;
    if (!alumnoId) {
      mensajePago.textContent = '❌ Debes seleccionar un alumno válido.';
      return;
    }

    // Convertimos mes a integer (1-12) y extraemos año de la fecha
    const mesInt = parseInt(mesSelect.value, 10);
    const fecha  = new Date(fechaInput.value);
    const anio   = fecha.getFullYear();

    const payload = {
      alumno_id:   alumnoId,
      grado_id:    parseInt(gradoSelect.value, 10),
      seccion_id:  parseInt(seccionSelect.value, 10),
      mes:         mesInt,
      año:         anio,
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
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        mensajePago.innerHTML = Object.values(errors)
          .flat()
          .map(msg => `❌ ${msg}`)
          .join('<br>');
      } else {
        console.error('Error registrando pago:', err);
        mensajePago.textContent = '❌ Error al registrar el pago.';
      }
    }
  });

  // Ocultar sugerencias al hacer clic fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      listaCoincidencias.innerHTML = '';
    }
  });
}
