import '/resources/css/forms/gestionUsuarios/listaUsuarios.css';
import axios from 'axios';

export default function initListaUsuarios(container = document.querySelector('.lu-wrapper')) {
  if (!container) return;

  const selectRol      = container.querySelector('#selectRol');
  const buscador       = container.querySelector('#buscador');
  const sugerenciasDiv = container.querySelector('#sugerenciasNombres');
  const tbody          = container.querySelector('#tablaUsuarios tbody');
  const currentUserRol = document.querySelector('meta[name="rol-usuario"]')?.content || '';

  let usuarios = [];

  const limpiarSugerencias = () => sugerenciasDiv.innerHTML = '';

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
      const isAdmin = currentUserRol === 'admin';

      tr.innerHTML = `
        <td>${u.nombres} ${u.apellidos}</td>
        <td>${u.rol}</td>
        <td>
          ${isAdmin ? `<input type="password" class="nueva-pass" placeholder="Nueva contraseña" disabled>` : '••••••'}
        </td>
        <td>
          ${isAdmin ? `<button type="button" class="restablecer-btn">Restablecer</button>` : ''}
        </td>
      `;

      if (isAdmin) {
        const btn = tr.querySelector('.restablecer-btn');
        const input = tr.querySelector('.nueva-pass');

        btn.addEventListener('click', () => {
          if (btn.textContent === 'Restablecer') {
            input.disabled = false;
            input.focus();
            btn.textContent = 'Aceptar';
          } else {
            const nueva = input.value.trim();
            if (!nueva || nueva.length < 6) {
              mostrarMensaje('La contraseña debe tener al menos 6 caracteres.', true);
              return;
            }

            // Mostrar modal de confirmación
            const confirmacion = document.getElementById('confirmacion');
            const btnSi = document.getElementById('btn-si');
            const btnNo = document.getElementById('btn-no');
            confirmacion.style.display = 'flex';

            btnSi.onclick = async () => {
              confirmacion.style.display = 'none';
              try {
                await axios.put(`/usuarios/${u.id}`, { password: nueva });
                mostrarMensaje('Contraseña actualizada correctamente.');
                input.value = '';
                input.disabled = true;
                btn.textContent = 'Restablecer';
              } catch (e) {
                mostrarMensaje('Error al actualizar la contraseña.', true);
              }
            };

            btnNo.onclick = () => {
              confirmacion.style.display = 'none';
            };
          }
        });
      }

      tbody.appendChild(tr);
    });
  };

  const mostrarMensaje = (texto, error = false) => {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.style.background = error ? '#f8d7da' : '#d4edda';
    mensajeDiv.style.color = error ? '#721c24' : '#155724';
    mensajeDiv.style.borderColor = error ? '#f5c6cb' : '#c3e6cb';
    mensajeDiv.style.display = 'block';

    setTimeout(() => {
      mensajeDiv.style.display = 'none';
    }, 3000);
  };

  // Eventos de filtro
  selectRol.addEventListener('change', () => {
    buscador.value = '';
    limpiarSugerencias();
    renderUsuarios();
  });

  buscador.addEventListener('input', mostrarSugerencias);
  buscador.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

  // Carga inicial
  axios.get('/usuarios')
    .then(({ data }) => {
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

document.addEventListener('DOMContentLoaded', () => initListaUsuarios());
