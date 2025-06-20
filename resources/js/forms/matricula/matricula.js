import '/resources/css/forms/matricula/matricula.css';
import axios from 'axios';
import {
  fetchGrados,
  fetchSecciones,
  poblarSelect
} from '../utils/loadGradosSecciones.js';

export default async function initMatriculaForm(container = document.getElementById('form-container')) {
  const wrapper = container.querySelector('.m-wrapper');
  if (!wrapper) return;

  // CSRF & JSON headers
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.content;
    axios.defaults.headers.common['Accept']      = 'application/json';
  }

  // DOM references
  const form            = wrapper.querySelector('#matricula-form');
  const fechaNacimiento = wrapper.querySelector('#fecha-nacimiento');
  const edadInput       = wrapper.querySelector('#edad');
  const nivelSelect     = wrapper.querySelector('#nivel-educativo');
  const gradoSelect     = wrapper.querySelector('#grado');
  const seccionSelect   = wrapper.querySelector('#seccion');
  const mensajeBox      = wrapper.querySelector('#mensaje');
  const confirmBox      = wrapper.querySelector('#confirmacion');
  const btnSi           = wrapper.querySelector('#btn-si');
  const btnNo           = wrapper.querySelector('#btn-no');
  const confirmMsg      = wrapper.querySelector('#confirmacion-mensaje');

  // Utilitarios
  const mostrarMensaje = txt => {
    mensajeBox.textContent = txt;
    mensajeBox.style.display = 'block';
    setTimeout(() => mensajeBox.style.display = 'none', 4000);
  };

  const confirmar = txt => new Promise(res => {
    confirmBox.style.display = 'flex';
    confirmMsg.textContent = txt;
    btnSi.onclick = () => { confirmBox.style.display = 'none'; res(true); };
    btnNo.onclick = () => { confirmBox.style.display = 'none'; res(false); };
  });

  // Cálculo de edad
  fechaNacimiento?.addEventListener('change', () => {
    const birth = new Date(fechaNacimiento.value),
          today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    edadInput.value = isNaN(age) ? '' : age;
  });

  // === Carga dinámica de secciones ===
  try {
    const secciones = await fetchSecciones();
    poblarSelect(seccionSelect, secciones, 'Seleccione sección');
  } catch (err) {
    console.error('Error cargando secciones:', err);
    poblarSelect(seccionSelect, [], 'Error cargando sección');
  }

  // === Obtén todos los grados para filtrar ===
  let grados = [];
  try {
    grados = await fetchGrados();
  } catch (err) {
    console.error('Error cargando grados:', err);
    poblarSelect(gradoSelect, [], 'Error cargando grado');
  }

  // Mapa estático de IDs de grado por nivel
  const mapaGradosPorNivel = {
    Inicial:  [1, 2, 3],
    Primaria: [4, 5, 6, 7, 8, 9]
  };

  // Carga dinámica de grados según el nivel seleccionado
  nivelSelect?.addEventListener('change', () => {
    const nivel = nivelSelect.value;
    const ids   = mapaGradosPorNivel[nivel] || [];
    const filtrados = grados.filter(g => ids.includes(g.id));
    poblarSelect(gradoSelect, filtrados, 'Seleccione grado');
  });

  // Lectura de datos de alumno
  const leerDatosAlumno = () => {
    const get = field => wrapper.querySelector(`[name="${field}"]`)?.value || null;
    const sexoRaw = wrapper.querySelector('input[name="sexo"]:checked')?.value || '';
    const sexo    = sexoRaw.startsWith('M') ? 'M' : 'F';

    return {
      nombres:          get('nombres'),
      apellidos:        get('apellidos'),
      dni:              get('dni'),
      fecha_nacimiento: get('fecha_nacimiento'),
      sexo,
      direccion:        get('direccion'),
      nivel_educativo:  get('nivel_educativo'),
      grado_id:         get('grado_id'),
      seccion_id:       get('seccion_id'),
      edad:             parseInt(get('edad')) || null,
      estado_matricula: 'matriculado'
    };
  };

  // Lectura de datos de apoderado
  const leerDatosApoderado = alumno_id => {
    const get = field => wrapper.querySelector(`[name="${field}"]`)?.value || null;
    return {
      alumno_id,
      nombres:            get('apoderado_nombres'),
      apellidos:          get('apoderado_apellidos'),
      dni:                get('apoderado_dni'),
      parentesco:         get('parentesco'),
      celular:            get('celular'),
      correo_electronico: get('correo_electronico'),
    };
  };

  // Envío del formulario
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (! await confirmar('¿Deseas procesar la matrícula?')) return;

    const nombreVal = wrapper.querySelector('[name="nombres"]').value;
    const dniVal    = wrapper.querySelector('[name="dni"]').value;

    try {
      const { data: alumno } = await axios.post('/alumnos', leerDatosAlumno());
      await axios.post('/apoderados', leerDatosApoderado(alumno.id));

      window.alumnoParaPago = alumno.id;
      mostrarMensaje('✅ Matrícula y apoderado guardados.');
      form.reset();

      // Carga dinámica del pago
      setTimeout(async () => {
        container.innerHTML = '<p>Cargando pago...</p>';
        try {
          const res  = await fetch('/forms/matricula/pagoMatricula');
          const html = await res.text();
          container.innerHTML = html;
          container.querySelector('#resumen-nombre').value = nombreVal;
          container.querySelector('#resumen-dni').value    = dniVal;
          const pagoMod = await import('./pagoMatricula.js');
          if (typeof pagoMod.default === 'function') pagoMod.default(container);
        } catch(err) {
          console.error('Error cargando pago:', err);
          container.innerHTML = '<p>Error cargando pago.</p>';
        }
      }, 500);

    } catch(err) {
      if (err.response?.status === 422) {
        console.error('Validación fallida:', err.response.data.errors);
        mostrarMensaje('❌ Hay campos inválidos (revisa la consola).');
      } else {
        console.error(err);
        mostrarMensaje('❌ Error al guardar.');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initMatriculaForm());
