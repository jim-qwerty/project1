// resources/js/forms/gestionUsuarios/crearUsuarios.js
import '/resources/css/forms/gestionUsuarios/crearUsuarios.css';

export default function initCrearUsuarios(container = document.querySelector('.cu-wrapper')) {
  if (!container) return;

  const profesores = [
    { nombre: 'Juan Pérez' },
    { nombre: 'María García' },
    { nombre: 'Ana Gómez' },
    { nombre: 'Pedro Díaz' },
    { nombre: 'Lucía Torres' },
    { nombre: 'Carlos Ruiz' }
  ];

  // Referencias UI
  const rolSel      = container.querySelector('#rolUsuario');
  const buscadorInp = container.querySelector('#buscadorNombre');
  const sugerDiv    = container.querySelector('#sugerenciasNombres');
  const inputNombres  = container.querySelector('#inputNombres');
  const inputApellidos= container.querySelector('#inputApellidos');
  const passInp     = container.querySelector('#inputPassword');
  const form        = container.querySelector('#formularioCrearUsuario');
  const mensajeP    = container.querySelector('#mensaje');

  const limpiarSugerencias = () => sugerDiv.innerHTML = '';

  // Ahora devuelve solo nombres cuando rol=profesor
  const generarListaNombres = () => {
    return rolSel.value === 'profesor'
      ? profesores.map(p => p.nombre)
      : [];
  };

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
          const partes = nombre.split(' ');
          inputApellidos.value = partes.pop();
          inputNombres.value  = partes.join(' ');
          limpiarSugerencias();
        });
        sugerDiv.appendChild(div);
      });
  };

  // Eventos
  rolSel.addEventListener('change', () => {
    limpiarSugerencias();
  });
  buscadorInp.addEventListener('input', mostrarSugerencias);
  buscadorInp.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nuevoUsuario = {
      nombres:   inputNombres.value.trim(),
      apellidos: inputApellidos.value.trim(),
      password:  passInp.value,
      rol:       rolSel.value
    };
    console.log('Usuario creado:', nuevoUsuario);
    mensajeP.textContent = '✅ Usuario registrado correctamente.';
    mensajeP.style.color = 'green';

    form.reset();
    setTimeout(() => mensajeP.textContent = '', 3000);
  });
}

document.addEventListener('DOMContentLoaded', () => initCrearUsuarios());
