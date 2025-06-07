// resources/js/forms/gestionUsuarios/crearUsuarios.js
import '/resources/css/forms/gestionUsuarios/crearUsuarios.css';
import axios from 'axios';

export default function initCrearUsuarios(container = document.querySelector('.cu-wrapper')) {
  if (!container) return;

  const profesores = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María García' },
    { id: 3, nombre: 'Ana Gómez' },
    { id: 4, nombre: 'Pedro Díaz' },
    { id: 5, nombre: 'Lucía Torres' },
    { id: 6, nombre: 'Carlos Ruiz' }
  ];

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

  // Limpia las sugerencias de la lista
  const limpiarSugerencias = () => {
    sugerDiv.innerHTML = '';
  };

  // Devuelve sólo los nombres si el rol es profesor
  const generarListaNombres = () =>
    rolSel.value === 'profesor'
      ? profesores.map(p => p.nombre)
      : [];

  // Muestra la caja de sugerencias
  const mostrarSugerencias = () => {
    limpiarSugerencias();
    if (rolSel.value !== 'profesor') return;

    const term = buscadorInp.value.trim().toLowerCase();
    if (!term) return;

    generarListaNombres()
      .filter(nombre => nombre.toLowerCase().includes(term))
      .forEach(nombre => {
        const div = document.createElement('div');
        div.textContent = nombre;
        div.addEventListener('click', () => {
          buscadorInp.value = nombre;
          // Asignar el id correspondiente
          const docente = profesores.find(p => p.nombre === nombre);
          inputDocente.value = docente ? docente.id : '';
          // Rellenar nombres/apellidos
          const partes = nombre.split(' ');
          inputApellidos.value = partes.pop();
          inputNombres.value  = partes.join(' ');
          limpiarSugerencias();
        });
        sugerDiv.appendChild(div);
      });
  };

  // Configurar CSRF para Axios
  axios.defaults.headers.common['X-CSRF-TOKEN'] =
    document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // Eventos de sugerencias
  rolSel.addEventListener('change', limpiarSugerencias);
  buscadorInp.addEventListener('input', mostrarSugerencias);
  buscadorInp.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

  // Evento de envío del formulario
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Construimos el payload base
    const payload = {
      rol:           rolSel.value,
      nombres:       inputNombres.value.trim(),
      apellidos:     inputApellidos.value.trim(),
      username:      inputUsuario.value.trim(),
      password_hash: passInp.value,
      estado:        'activo'
    };

    // Solo añadimos docente_id si el rol es profesor y es un número válido
    if (rolSel.value === 'profesor') {
      const id = parseInt(inputDocente.value, 10);
      if (!isNaN(id)) {
        payload.docente_id = id;
      }
    }

    // Llamada AJAX
    axios.post('/usuarios', payload)
      .then(({ data }) => {
        mensajeP.textContent = '✅ Usuario registrado correctamente.';
        mensajeP.style.color = 'green';
        form.reset();
        setTimeout(() => mensajeP.textContent = '', 3000);
      })
      .catch(err => {
        // Mostrar detalle en consola
        console.error('Error completo:', JSON.stringify(err.response?.data, null, 2));

        // Mostrar errores de validación en pantalla
        const errs = err.response?.data?.errors;
        if (errs) {
          mensajeP.innerHTML = Object
            .values(errs)
            .flat()
            .join('<br>');
        } else {
          mensajeP.textContent = '❌ Error: ' +
            (err.response?.data?.message || err.message);
        }
        mensajeP.style.color = 'red';
      });
  });
}

document.addEventListener('DOMContentLoaded', () => initCrearUsuarios());
