import '/resources/css/forms/docentes/listaDocentes.css';
import axios from 'axios';
import { fetchGrados } from '../utils/loadGradosSecciones.js';

export default async function initListaProfesores(
  container = document.querySelector('#lista-profesores')
) {
  if (!container) return;

  const gradoFiltro = container.querySelector('#gradoFiltro');
  const buscador    = container.querySelector('#buscador');
  const cuerpoTabla = container.querySelector('#cuerpoTabla');

  // Crear y posicionar el contenedor de sugerencias
  const sugerencias = document.createElement('div');
  sugerencias.className = 'lp-sugerencias';
  const wrapperBuscador = buscador.parentNode;
  wrapperBuscador.style.position = 'relative';
  wrapperBuscador.appendChild(sugerencias);
  sugerencias.style.position = 'absolute';
  sugerencias.style.top = `${buscador.offsetTop + buscador.offsetHeight + 4}px`;
  sugerencias.style.left = `${buscador.offsetLeft}px`;
  sugerencias.style.width = `${buscador.offsetWidth}px`;
  sugerencias.style.background = '#fff';
  sugerencias.style.border = '1px solid #ccc';
  sugerencias.style.zIndex = '1000';

  let profesores = [];

  // 1) Carga dinámica de grados
  try {
    const gradosBD = await fetchGrados();
    gradoFiltro.innerHTML = '<option value="">Seleccione grado</option>';
    gradosBD.forEach(g => {
      gradoFiltro.insertAdjacentHTML(
        'beforeend',
        `<option value="${g.nombre}">${g.nombre}</option>`
      );
    });
  } catch (err) {
    console.error('No se pudieron cargar los grados:', err);
  }

  // 2) Carga inicial de profesores en memoria
  try {
    const { data } = await axios.get('/docentes');
    profesores = data;
  } catch (err) {
    console.error('Error cargando docentes:', err);
  }

  // 3) Renderizar tabla con lista dada
  const renderTabla = lista => {
    cuerpoTabla.innerHTML = '';
    lista.forEach((profesor, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${profesor.nombres}</td>
        <td>${profesor.apellidos}</td>
        <td>${profesor.grado_asignado?.nombre ?? ''}</td>
        <td>${profesor.seccion_asignada?.nombre ?? ''}</td>
        <td>${profesor.correo_electronico}</td>
        <td>${profesor.celular}</td>
        <td class="estado-radio">
          <label><input type="radio" name="estado${index}" value="activo" ${profesor.estado === 'activo' ? 'checked' : ''}>Activo</label>
          <label><input type="radio" name="estado${index}" value="inactivo" ${profesor.estado === 'inactivo' ? 'checked' : ''}>Inactivo</label>
        </td>
        <td><button type="button" class="editar">Actualizar</button></td>
      `;
      cuerpoTabla.appendChild(fila);

      // Agregar funcionalidad al botón "Actualizar"
      const btnActualizar = fila.querySelector('.editar');
      btnActualizar.addEventListener('click', async () => {
        const radios = fila.querySelectorAll('input[type="radio"]');
        let estadoSeleccionado;
        radios.forEach(radio => {
          if (radio.checked) estadoSeleccionado = radio.value;
        });

        if (estadoSeleccionado === profesor.estado) {
          alert('No se realizaron cambios en el estado.');
          return;
        }

        try {
          await axios.put(`/docentes/${profesor.id}`, {
            estado: estadoSeleccionado
          });

          alert('Estado actualizado correctamente.');
          profesor.estado = estadoSeleccionado;

        } catch (err) {
          console.error('Error actualizando estado:', err);
          alert('Error al actualizar el estado del docente.');
        }
      });
    });
  };

  // 4) Filtrar profesores por grado
  const filtrarPorGrado = () => {
    const gradoSel = gradoFiltro.value;
    if (!gradoSel) {
      cuerpoTabla.innerHTML = '';
      return [];
    }
    return profesores.filter(p => p.grado_asignado?.nombre === gradoSel);
  };

  gradoFiltro.addEventListener('change', () => {
    buscador.value = '';
    sugerencias.innerHTML = '';
    const lista = filtrarPorGrado();
    renderTabla(lista);
  });

  // 5) Autocompletar búsqueda por nombre o apellido
  buscador.addEventListener('input', () => {
    const texto = buscador.value.trim().toLowerCase();
    const gradoSel = gradoFiltro.value;
    if (!texto || !gradoSel) {
      sugerencias.style.display = 'none';
      return;
    }

    const candidatos = profesores.filter(p =>
      p.grado_asignado?.nombre === gradoSel &&
      (`${p.nombres} ${p.apellidos}`).toLowerCase().includes(texto)
    ).slice(0, 5);

    sugerencias.innerHTML = '';
    candidatos.forEach(p => {
      const div = document.createElement('div');
      div.textContent = `${p.nombres} ${p.apellidos}`;
      div.style.padding = '4px 8px';
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        renderTabla([p]);
        sugerencias.innerHTML = '';
        buscador.value = div.textContent;
      });
      sugerencias.appendChild(div);
    });

    sugerencias.style.display = candidatos.length ? 'block' : 'none';
  });

  // Cerrar sugerencias si se hace clic fuera
  document.addEventListener('click', e => {
    if (!container.contains(e.target) && e.target !== buscador) {
      sugerencias.style.display = 'none';
    }
  });
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => initListaProfesores());
