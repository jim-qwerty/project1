import '/resources/css/forms/profesores/listaProfesores.css';

export default function initListaProfesores(container = document.querySelector('lista-profesores')) {
  if (!container) return;

  const gradoFiltro = container.querySelector('#gradoFiltro');
  const buscador = container.querySelector('#buscador');
  const cuerpoTabla = container.querySelector('#cuerpoTabla');

  const profesores = [
    {
      nombre: "Juan",
      apellido: "Pérez",
      grado: "1ro",
      seccion: "A",
      estado: "activo"
    },
    {
      nombre: "Ana",
      apellido: "Gómez",
      grado: "2do",
      seccion: "B",
      estado: "inactivo"
    },
    {
      nombre: "Luis",
      apellido: "Soto",
      grado: "1ro",
      seccion: "C",
      estado: "activo"
    }
  ];

  const renderTabla = (filtrados) => {
    cuerpoTabla.innerHTML = '';
    filtrados.forEach((profesor, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${profesor.nombre}</td>
        <td>${profesor.apellido}</td>
        <td>${profesor.grado}</td>
        <td>${profesor.seccion}</td>
        <td class="estado-radio">
          <label><input type="radio" name="estado${index}" value="activo" ${profesor.estado === 'activo' ? 'checked' : ''}> Activo</label>
          <label><input type="radio" name="estado${index}" value="inactivo" ${profesor.estado === 'inactivo' ? 'checked' : ''}> Inactivo</label>
        </td>
        <td><button type="button" class="editar">Editar</button></td>
      `;
      cuerpoTabla.appendChild(fila);
    });
  };

  const filtrarProfesores = () => {
    const gradoSeleccionado = gradoFiltro.value.toLowerCase();
    const textoBusqueda = buscador.value.toLowerCase();

    const filtrados = profesores.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(textoBusqueda);
      const coincideApellido = p.apellido.toLowerCase().includes(textoBusqueda);
      const coincideGrado = gradoSeleccionado === "" || p.grado.toLowerCase() === gradoSeleccionado;

      return (coincideNombre || coincideApellido) && coincideGrado;
    });

    renderTabla(filtrados);
  };

  gradoFiltro.addEventListener('change', filtrarProfesores);
  buscador.addEventListener('input', filtrarProfesores);

  renderTabla(profesores);
}
