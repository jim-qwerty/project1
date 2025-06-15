// resources/js/forms/gestionUsuarios/crearUsuarios.js
import '/resources/css/forms/gestionUsuarios/crearUsuarios.css';
import axios from 'axios';

export default function initCrearUsuarios(container = document.querySelector('.cu-wrapper')) {
  if (!container) return;

  let profesores = [];

  // Referencias UI
  const rolSel         = container.querySelector('#rolUsuario');
  const buscadorInp    = container.querySelector('#buscadorNombre');
  const sugerDiv       = container.querySelector('#sugerenciasNombres');
  const inputDocente   = container.querySelector('#inputDocenteId');
  const inputNombres   = container.querySelector('#inputNombres');
  const inputApellidos = container.querySelector('#inputApellidos');
  const inputUsuario   = container.querySelector('#inputUsuario');
  const passInp        = container.querySelector('#inputPassword');
  const form           = container.querySelector('#formularioCrearUsuario');
  const mensajeP       = container.querySelector('#mensaje');

  // Activa o desactiva el buscador según rol
  const toggleBuscador = () => {
    const esProfesor = rolSel.value === 'profesor';
    buscadorInp.disabled = !esProfesor;
    if (!esProfesor) {
      buscadorInp.value = '';
      inputDocente.value = '';
      inputNombres.value = '';
      inputApellidos.value = '';
      sugerDiv.innerHTML = '';
    }
  };

  // Muestra las sugerencias
  const mostrarSugerencias = () => {
    sugerDiv.innerHTML = '';
    if (rolSel.value !== 'profesor') return;

    const term = buscadorInp.value.trim().toLowerCase();
    if (!term) return;

    profesores
      .filter(p => p.nombre.toLowerCase().includes(term))
      .forEach(p => {
        const div = document.createElement('div');
        div.textContent = p.nombre;
        div.addEventListener('click', () => {
          buscadorInp.value    = p.nombre;
          inputDocente.value   = p.id;
          // Ahora copiamos directamente los campos separados:
          inputNombres.value   = p.nombres;
          inputApellidos.value = p.apellidos;
          sugerDiv.innerHTML   = '';
        });
        sugerDiv.appendChild(div);
      });
  };

  // Configura CSRF para Axios
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.getAttribute('content');
  }

  // Eventos
  rolSel.addEventListener('change', toggleBuscador);
  buscadorInp.addEventListener('input', mostrarSugerencias);
  buscadorInp.addEventListener('blur', () => setTimeout(() => sugerDiv.innerHTML = '', 150));

  // Inicializar
  toggleBuscador();

  // Cargar profesores
  axios.get('/docentes')
    .then(({ data }) => {
      // Guardamos nombres y apellidos por separado para evitar errores de split
      profesores = data.map(d => ({
        id:        d.id,
        nombres:   d.nombres,
        apellidos: d.apellidos,
        nombre:    `${d.nombres} ${d.apellidos}`
      }));
    })
    .catch(err => console.error('Error cargando docentes:', err));

  // Envío del formulario
  form.addEventListener('submit', e => {
    e.preventDefault();
    mensajeP.textContent = '';

    // Validación de contraseña
    if (passInp.value.length < 6) {
      mensajeP.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      mensajeP.style.color   = 'red';
      return;
    }

    const payload = {
      rol:       rolSel.value,
      nombres:   inputNombres.value.trim(),
      apellidos: inputApellidos.value.trim(),
      username:  inputUsuario.value.trim(),
      password:  passInp.value,
      estado:    'activo'
    };

    if (rolSel.value === 'profesor') {
      const id = parseInt(inputDocente.value, 10);
      if (!isNaN(id)) payload.docente_id = id;
    }

    axios.post('/usuarios', payload)
      .then(() => {
        mensajeP.textContent = '✅ Usuario registrado correctamente.';
        mensajeP.style.color = 'green';
        form.reset();
        toggleBuscador();
        setTimeout(() => mensajeP.textContent = '', 3000);
      })
      .catch(err => {
        console.error('Error completo:', err.response?.data);
        const errs = err.response?.data?.errors;
        if (errs) {
          mensajeP.innerHTML = Object.values(errs).flat().join('<br>');
        } else {
          mensajeP.textContent = '❌ Error: ' +
            (err.response?.data?.message || err.message);
        }
        mensajeP.style.color = 'red';
      });
  });
}

document.addEventListener('DOMContentLoaded', () => initCrearUsuarios());
