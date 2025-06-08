// resources/js/forms/docentes/listaDocentes.js
import '/resources/css/forms/docentes/listaDocentes.css';
import axios from 'axios';

export default function initListaProfesores(
  container = document.querySelector('#lista-profesores')
) {
  if (!container) return;

  const gradoFiltro = container.querySelector('#gradoFiltro');
  const buscador    = container.querySelector('#buscador');
  const cuerpoTabla = container.querySelector('#cuerpoTabla');

  // Inicializamos vacío; luego cargamos desde la API
  let profesores = [];

  // Renderiza las filas según el array filtrado
  const renderTabla = (filtrados) => {
    cuerpoTabla.innerHTML = '';
    filtrados.forEach((profesor, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
  <td>${profesor.nombres}</td>
  <td>${profesor.apellidos}</td>
  <td>${profesor.grado_asignado?.nombre   ?? ''}</td>
  <td>${profesor.seccion_asignada?.nombre ?? ''}</td>
  <td class="estado-radio">
    <label>
      <input
        type="radio"
        name="estado${index}"
        value="activo"
        ${profesor.estado === 'activo' ? 'checked' : ''}>
      Activo
    </label>
    <label>
      <input
        type="radio"
        name="estado${index}"
        value="inactivo"
        ${profesor.estado === 'inactivo' ? 'checked' : ''}>
      Inactivo
    </label>
  </td>
  <td>
    <button type="button" class="editar">Editar</button>
  </td>
`;
      cuerpoTabla.appendChild(fila);
    });
  };

  // Filtra por grado y/o texto de búsqueda
  const filtrarProfesores = () => {
    const gradoSel = gradoFiltro.value.toLowerCase();
    const text     = buscador.value.toLowerCase();

    const filtrados = profesores.filter(p => {
      const matchNombre   = p.nombres.toLowerCase().includes(text);
      const matchApellido = p.apellidos.toLowerCase().includes(text);
      const matchGrado    = !gradoSel || (p.gradoAsignado?.nombre.toLowerCase() === gradoSel);
      return (matchNombre || matchApellido) && matchGrado;
    });

    renderTabla(filtrados);
  };

  // Eventos de filtro
  gradoFiltro.addEventListener('change', filtrarProfesores);
  buscador.addEventListener('input', filtrarProfesores);

  // Carga inicial de datos desde la API
  axios.get('/docentes')
    .then(({ data }) => {
      profesores = data;
      renderTabla(profesores);
    })
    .catch(err => {
      console.error('Error cargando docentes:', err);
    });
}

// Inicialización al cargar DOM
document.addEventListener('DOMContentLoaded', () => initListaProfesores());
