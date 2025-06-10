// resources/js/forms/matricula/matricula.js

import '/resources/css/forms/matricula/matricula.css';
import axios from 'axios';  // Asegúrate de tener axios instalado

export default function initMatriculaForm(container = document.querySelector('.m-wrapper')) {
  if (!container) return;

  // === Configuración CSRF para Axios ===
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.getAttribute('content');
  } else {
    console.warn("No se encontró <meta name=\"csrf-token\" />");
  }

  // Referencias DOM
  const fechaNacimiento  = container.querySelector('#fecha-nacimiento');
  const edadInput         = container.querySelector('#edad');
  const nivelSelect       = container.querySelector('#nivel-educativo');
  const gradoSelect       = container.querySelector('#grado');
  const seccionSelect     = container.querySelector('#seccion');
  const formMatricula     = container.querySelector('#matricula-form');
  const pagoForm          = container.querySelector('#pago-form');
  const mensajeBox        = container.querySelector('#mensaje');
  const confirmBox        = container.querySelector('#confirmacion');
  const btnSi             = container.querySelector('#btn-si');
  const btnNo             = container.querySelector('#btn-no');
  const confirmMsg        = container.querySelector('#confirmacion-mensaje');
  const btnRegresar       = container.querySelector('#regresar-btn');

  // === Valores estáticos de Grados por Nivel ===
  const gradosPorNivel = {
    Inicial: [
      { id: 1, nombre: '3 años' },
      { id: 2, nombre: '4 años' },
      { id: 3, nombre: '5 años' }
    ],
    Primaria: [
      { id: 4, nombre: 'Primero' },
      { id: 5, nombre: 'Segundo' },
      { id: 6, nombre: 'Tercero' },
      { id: 7, nombre: 'Cuarto' },
      { id: 8, nombre: 'Quinto' },
      { id: 9, nombre: 'Sexto' }
    ]
  };

  // === Valores estáticos de Secciones ===
  const seccionesEstaticas = [
    { id: 1, nombre: 'A' },
    { id: 2, nombre: 'B' },
    { id: 3, nombre: 'C' }
  ];

  // Población inicial de Secciones
  seccionesEstaticas.forEach(s => {
    seccionSelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${s.id}">${s.nombre}</option>`
    );
  });

  // Utilidades:
  const mostrarMensaje = texto => {
    if (!mensajeBox) return;
    mensajeBox.textContent = texto;
    mensajeBox.style.display = 'block';
    setTimeout(() => mensajeBox.style.display = 'none', 4000);
  };

  const confirmar = texto => new Promise(res => {
    confirmBox.style.display = 'flex';
    confirmMsg.textContent = texto;
    btnSi.onclick = () => { confirmBox.style.display = 'none'; res(true); };
    btnNo.onclick = () => { confirmBox.style.display = 'none'; res(false); };
  });

  // Calcular edad al cambiar fecha
  if (fechaNacimiento && edadInput) {
    fechaNacimiento.addEventListener('change', () => {
      const birth = new Date(fechaNacimiento.value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      edadInput.value = isNaN(age) ? '' : age;
    });
  }

  // Cargar grados según nivel educativo
  if (nivelSelect && gradoSelect) {
    nivelSelect.addEventListener('change', () => {
      const nivel = nivelSelect.value;
      // Limpia el select de grado
      gradoSelect.innerHTML = '<option value="">Seleccione grado</option>';
      // Pobla solo si existe nivel
      (gradosPorNivel[nivel] || []).forEach(g => {
        gradoSelect.insertAdjacentHTML(
          'beforeend',
          `<option value="${g.id}">${g.nombre}</option>`
        );
      });
    });
  }

  // Leer datos del alumno
  const leerDatosAlumno = () => {
    const get = sel => container.querySelector(sel)?.value || null;
    const sexoRaw = Array.from(container.querySelectorAll('input[name="sexo"]'))
                        .find(i => i.checked)?.value || '';
    return {
      nombres:           get('input[placeholder="Ingrese nombres"]'),
      apellidos:         get('input[placeholder="Ingrese apellidos"]'),
      dni:               get('input[placeholder="Ingrese DNI"]'),
      fecha_nacimiento:  get('#fecha-nacimiento'),
      edad:              parseInt(get('#edad')) || null,
      sexo:              sexoRaw.startsWith('M') ? 'M' : 'F',
      nivel_educativo:   get('#nivel-educativo'),
      grado_id:          get('#grado'),
      seccion_id:        get('#seccion'),
      direccion:         get('input[placeholder="Ingrese dirección"]'),
      estado_matricula:  'matriculado'
    };
  };

  // Leer datos del apoderado
  const leerDatosApoderado = alumno_id => {
    const get = sel => container.querySelector(sel)?.value || null;
    return {
      alumno_id,
      nombres:            get('input[placeholder="Ingrese nombres del apoderado"]'),
      apellidos:          get('input[placeholder="Ingrese apellidos del apoderado"]'),
      dni:                get('input[placeholder="Ingrese DNI del apoderado"]'),
      parentesco:         get('input[placeholder="Padre, Madre, Tutor, etc."]'),
      celular:            get('input[placeholder="Ingrese celular"]'),
      correo_electronico: get('input[type="email"]')
    };
  };

  // Envío del formulario de matrícula
  formMatricula.addEventListener('submit', async e => {
    e.preventDefault();
    if (!await confirmar('¿Deseas procesar la matrícula?')) return;
    try {
      const { data: alumno } = await axios.post('/alumnos', leerDatosAlumno());
      await axios.post('/apoderados', leerDatosApoderado(alumno.id));
      mostrarMensaje('✅ Matrícula y apoderado guardados.');
      formMatricula.reset();
    } catch (err) {
      console.error(err.response || err);
      mostrarMensaje('❌ Error al guardar.');
    }
  });

  // Lógica de pago y botón regresar
  if (pagoForm) {
    pagoForm.addEventListener('submit', e => {
      e.preventDefault();
      confirmar('¿Confirmar pago?').then(ok => {
        if (!ok) return;
        mostrarMensaje('¡Pago exitoso!');
        formMatricula.reset();
        pagoForm.reset();
        pagoForm.style.display = 'none';
        formMatricula.style.display = 'block';
      });
    });
  }

  if (btnRegresar) {
    btnRegresar.addEventListener('click', () => {
      pagoForm.style.display = 'none';
      formMatricula.style.display = 'block';
    });
  }
} 

document.addEventListener('DOMContentLoaded', () => initMatriculaForm());
