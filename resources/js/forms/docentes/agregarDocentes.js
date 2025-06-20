import '/resources/css/forms/docentes/agregarDocentes.css';
import axios from 'axios';
import { initGradosSecciones } from '../utils/loadGradosSecciones.js';

export default async function initAgregarProfesores(
  container = document.querySelector('#agregar-profesores')
) {
  if (!container) {
    console.warn("No se encontró el contenedor #agregar-profesores");
    return;
  }

  const form             = container.querySelector('#formulario-profesor');
  const gradoSelect      = form.querySelector('#gradoAsignado');
  const seccionSelect    = form.querySelector('#seccionAsignada');
  const mensaje          = container.querySelector('#mensaje');
  const fechaNacimiento  = form.querySelector('#fechaNacimiento');
  const edadInput        = form.querySelector('#edad');

  if (!form || !fechaNacimiento || !edadInput) {
    console.warn("Faltan elementos esenciales en el formulario");
    return;
  }

  // Configura CSRF para Axios
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.getAttribute('content');
  } else {
    console.warn("No se encontró <meta name=\"csrf-token\" >");
  }

  // === 1) Carga dinámica de grados y secciones desde la BD ===
  try {
    await initGradosSecciones(gradoSelect, seccionSelect);
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    mensaje.textContent = '❌ No se pudieron cargar grados y/o secciones.';
    mensaje.style.color = 'red';
  }

  // 2) Calcular edad al cambiar fecha
  fechaNacimiento.addEventListener('change', () => {
    const fecha = new Date(fechaNacimiento.value);
    const hoy   = new Date();
    let edad    = hoy.getFullYear() - fecha.getFullYear();
    const mes   = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) edad--;
    edadInput.value = isNaN(edad) ? '' : edad;
  });

  // 3) Envío del formulario
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const datos = {
      nombres:             form.nombres.value.trim(),
      apellidos:           form.apellidos.value.trim(),
      dni:                 form.dni.value.trim(),
      fecha_nacimiento:    form.fecha_nacimiento.value,
      edad:                form.edad.value || null,
      grado_asignado_id:   gradoSelect.value,
      seccion_asignada_id: seccionSelect.value,
      correo_electronico:  form.correo_electronico.value.trim(),
      celular:             form.celular.value.trim(),
      direccion:           form.direccion.value.trim(),
      sexo:                form.sexo.value,
      estado:              'activo'
    };

    try {
      const { data } = await axios.post('/docentes', datos);
      mensaje.textContent = '✅ Profesor registrado correctamente.';
      mensaje.style.color = 'green';
      form.reset();
      edadInput.value = '';
      // Recargar grados y secciones en caso de que hayan cambiado
      await initGradosSecciones(gradoSelect, seccionSelect);
      setTimeout(() => mensaje.textContent = '', 3000);
    } catch (err) {
      console.error('Error completo:', err.response?.data || err);
      const errs = err.response?.data?.errors;
      if (errs) {
        mensaje.innerHTML = Object.values(errs).flat().join('<br>');
      } else {
        mensaje.textContent = '❌ Error: ' + (err.response?.data?.message || err.message);
      }
      mensaje.style.color = 'red';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => initAgregarProfesores());
