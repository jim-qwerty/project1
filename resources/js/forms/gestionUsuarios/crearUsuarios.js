// resources/js/forms/gestionUsuarios/crearUsuarios.js
import '/resources/css/forms/gestionUsuarios/crearUsuarios.css';
import axios from 'axios';

export default function initCrearUsuarios(container = document.querySelector('.cu-wrapper')) {
  if (!container) return;

  // Array que luego llenaremos desde la API
  let profesores = [];

  // Referencias UI
  const rolSel        = container.querySelector('#rolUsuario');
  const buscadorInp   = container.querySelector('#buscadorNombre');
  const sugerDiv      = container.querySelector('#sugerenciasNombres');
  const inputDocente  = container.querySelector('#inputDocenteId');
  const inputNombres  = container.querySelector('#inputNombres');
  const inputApellidos= container.querySelector('#inputApellidos');
  const inputUsuario  = container.querySelector('#inputUsuario');
  const passInp       = container.querySelector('#inputPassword');
  const form          = container.querySelector('#formularioCrearUsuario');
  const mensajeP      = container.querySelector('#mensaje');

  // Deshabilita o habilita el buscador según rol
  const toggleBuscador = () => {
    const esProfesor = rolSel.value === 'profesor';
    buscadorInp.disabled = !esProfesor;
    if (!esProfesor) {
      buscadorInp.value = '';
      inputDocente.value = '';
      limpiarSugerencias();
    }
  };

  // Limpia el contenedor de sugerencias
  const limpiarSugerencias = () => {
    sugerDiv.innerHTML = '';
  };

  // Filtra los nombres de profesores según el término
  const mostrarSugerencias = () => {
    limpiarSugerencias();
    if (rolSel.value !== 'profesor') return;

    const term = buscadorInp.value.trim().toLowerCase();
    if (!term) return;

    profesores
      .map(p => p.nombre)
      .filter(nombre => nombre.toLowerCase().includes(term))
      .forEach(nombre => {
        const div = document.createElement('div');
        div.textContent = nombre;
        div.addEventListener('click', () => {
          buscadorInp.value = nombre;
          // Busca el objeto completo para obtener el id
          const docente = profesores.find(p => p.nombre === nombre);
          inputDocente.value = docente?.id || '';
          // Rellena los campos de nombre y apellido
          const partes = nombre.split(' ');
          inputApellidos.value = partes.pop();
          inputNombres.value  = partes.join(' ');
          limpiarSugerencias();
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
  buscadorInp.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

  // Inicializa el estado del buscador
  toggleBuscador();

  // ==== 1) Carga los profesores desde la API ====
  axios.get('/docentes')
    .then(({ data }) => {
      // data debe ser un array de objetos { id, nombres, apellidos, ... }
      // Aquí transformamos en [{ id, nombre: "Nombres Apellidos" }, ...]
      profesores = data.map(d => ({
        id: d.id,
        nombre: `${d.nombres} ${d.apellidos}`
      }));
    })
    .catch(err => console.error('Error cargando docentes:', err));
  // ==============================================

  // Envío del formulario
  form.addEventListener('submit', e => {
    e.preventDefault();

    const payload = {
      rol:           rolSel.value,
      nombres:       inputNombres.value.trim(),
      apellidos:     inputApellidos.value.trim(),
      username:      inputUsuario.value.trim(),
      password_hash: passInp.value,
      estado:        'activo'
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
        console.error('Error completo:', JSON.stringify(err.response?.data, null, 2));
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
