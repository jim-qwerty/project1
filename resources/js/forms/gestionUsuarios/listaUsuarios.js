// resources/js/forms/gestionUsuarios/listaUsuarios.js
import '/resources/css/forms/gestionUsuarios/listaUsuarios.css';
import axios from 'axios';

export default function initListaUsuarios(container = document.querySelector('.lu-wrapper')) {
  if (!container) return;

  const selectRol      = container.querySelector('#selectRol');
  const buscador       = container.querySelector('#buscador');
  const sugerenciasDiv = container.querySelector('#sugerenciasNombres');
  const tbody          = container.querySelector('#tablaUsuarios tbody');

  // Donde guardaremos los usuarios traídos de la API
  let usuarios = [];

  // Limpiar sugerencias
  const limpiarSugerencias = () => {
    sugerenciasDiv.innerHTML = '';
  };

  // Mostrar sugerencias filtradas
  const mostrarSugerencias = () => {
    limpiarSugerencias();
    const term = buscador.value.trim().toLowerCase();
    if (!term) return;

    usuarios
      .map(u => u.nombres + ' ' + u.apellidos)
      .filter(full => full.toLowerCase().includes(term))
      .forEach(full => {
        const div = document.createElement('div');
        div.textContent = full;
        div.addEventListener('click', () => {
          buscador.value = full;
          limpiarSugerencias();
          renderUsuarios({ porNombre: full });
        });
        sugerenciasDiv.appendChild(div);
      });
  };

  // Renderizar la tabla
  const renderUsuarios = ({ porNombre = null } = {}) => {
    const rol = selectRol.value.toLowerCase();
    tbody.innerHTML = '';

    const filtrados = usuarios.filter(u => {
      const full = (u.nombres + ' ' + u.apellidos).toLowerCase();
      const okRol = !rol || u.rol === rol;
      const okName = porNombre ? full === porNombre.toLowerCase() : true;
      return okRol && okName;
    });

    filtrados.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.nombres} ${u.apellidos}</td>
        <td>${u.rol}</td>
        <td>
          <span class="pass-mask" data-real="••••••">••••••</span>
        </td>
        <td>
          <button type="button" class="ver-btn">Ver</button>
        </td>
      `;
      // Toggle de contraseña
      const span = tr.querySelector('.pass-mask');
      const btn  = tr.querySelector('.ver-btn');
      btn.addEventListener('click', () => {
        const visible = span.textContent !== '••••••';
        span.textContent = visible ? '••••••' : span.dataset.real;
        btn.textContent = visible ? 'Ver' : 'Ocultar';
      });

      tbody.appendChild(tr);
    });
  };

  // Eventos de filtro
  selectRol.addEventListener('change', () => {
    buscador.value = '';
    limpiarSugerencias();
    renderUsuarios();
  });
  buscador.addEventListener('input', mostrarSugerencias);
  buscador.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

  // Carga inicial de usuarios desde la BD
  axios.get('/usuarios')
    .then(({ data }) => {
      // data contiene [{nombres,apellidos,rol,…},…]
      usuarios = data.map(u => ({
        id: u.id,
        nombres: u.nombres,
        apellidos: u.apellidos,
        rol: u.rol,
      }));
      renderUsuarios();
    })
    .catch(err => {
      console.error('Error cargando usuarios:', err);
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => initListaUsuarios());
