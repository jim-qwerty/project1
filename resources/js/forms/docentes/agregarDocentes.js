// resources/js/forms/docentes/agregarDocentes.js
import '/resources/css/forms/docentes/agregarDocentes.css';
import axios from 'axios';

export default function initAgregarProfesores(
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

  // Configura CSRF para Axios (solo si existe el meta)
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.getAttribute('content');
  } else {
    console.warn("No se encontró <meta name=\"csrf-token\">");
  }

  // === 1) Sección de valores estáticos ===
  // Si quieres asegurar siempre unas opciones mínimas, rellena aquí:
  const gradosEstaticos = [
    { id: 1, nombre: '1' },
    { id: 2, nombre: '2' },
    { id: 3, nombre: '3' },
    { id: 4, nombre: '4' },
    { id: 5, nombre: '5' },
    { id: 6, nombre: '6' },
  ];
  const seccionesEstaticas = [
    { id: 'A', nombre: 'A' },
    { id: 'B', nombre: 'B' },
    { id: 'C', nombre: 'C' },
    
  ];

  // Inserta los valores estáticos
  gradosEstaticos.forEach(g =>
    gradoSelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${g.id}">${g.nombre}</option>`
    )
  );
  seccionesEstaticas.forEach(s =>
    seccionSelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${s.id}">${s.nombre}</option>`
    )
  );
  // ======================================

  // Calcular edad al cambiar fecha
  fechaNacimiento.addEventListener('change', () => {
    const fecha = new Date(fechaNacimiento.value);
    const hoy   = new Date();
    let edad    = hoy.getFullYear() - fecha.getFullYear();
    const mes   = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) edad--;
    edadInput.value = isNaN(edad) ? '' : edad;
  });


  /*
  // ====== Cargar datos dinámicos (si existen) ======
  if (window.initialData) {
    // Si el backend embebe initialData, sobreescribe los estáticos:
    const { grados, secciones } = window.initialData;
    gradoSelect.innerHTML    = '<option value="">Seleccione un grado</option>';
    seccionSelect.innerHTML  = '<option value="">Seleccione una sección</option>';

    grados.forEach(g =>
      gradoSelect.insertAdjacentHTML(
        'beforeend',
        `<option value="${g.id}">${g.nombre}</option>`
      )
    );
    secciones.forEach(s =>
      seccionSelect.insertAdjacentHTML(
        'beforeend',
        `<option value="${s.id}">${s.nombre ?? s.id}</option>`
      )
    );
  } else {
    // Intento por API si no hay initialData
    axios.get('/api/grados')
      .then(({ data }) => {
        gradoSelect.innerHTML = '<option value="">Seleccione un grado</option>';
        data.forEach(g =>
          gradoSelect.insertAdjacentHTML(
            'beforeend',
            `<option value="${g.id}">${g.nombre}</option>`
          )
        );
      })
      .catch(() => {/* ignora fallo, quedan los estáticos });
/*
    axios.get('/api/secciones')
      .then(({ data }) => {
        seccionSelect.innerHTML = '<option value="">Seleccione una sección</option>';
        data.forEach(s =>
          seccionSelect.insertAdjacentHTML(
            'beforeend',
            `<option value="${s.id}">${s.nombre ?? s.id}</option>`
          )
        );
      })
      .catch(() => {/* ignora fallo, quedan los estáticos });
  }

  */

  // ====== Envío del formulario ======
  form.addEventListener('submit', e => {
    e.preventDefault();

    const datos = {
      nombres:             form.nombres.value.trim(),
      apellidos:           form.apellidos.value.trim(),
      dni:                 form.dni.value.trim(),
      fecha_nacimiento:    form.fecha_nacimiento.value,
      edad:                form.edad.value || null,
      grado_asignado_id:   form.grado_asignado_id.value,
      seccion_asignada_id: form.seccion_asignada_id.value,
      correo_electronico:  form.correo_electronico.value.trim(),
      celular:             form.celular.value.trim(),
      direccion:           form.direccion.value.trim(),
      sexo:                form.sexo.value,
      estado:              'activo'
    };

    axios.post('/docentes', datos)
      .then(({ data }) => {
        mensaje.textContent = '✅ Profesor registrado correctamente.';
        mensaje.style.color = 'green';
        form.reset();
        edadInput.value = '';
        setTimeout(() => mensaje.textContent = '', 3000);
      })
      .catch(err => {
        console.error('Error completo:', JSON.stringify(err.response?.data, null, 2));
        const errs = err.response?.data?.errors;
        if (errs) {
          mensaje.innerHTML = Object.values(errs).flat().join('<br>');
        } else {
          mensaje.textContent = '❌ Error: ' +
            (err.response?.data?.message || err.message);
        }
        mensaje.style.color = 'red';
      });
  });
}

document.addEventListener('DOMContentLoaded', () => initAgregarProfesores());
