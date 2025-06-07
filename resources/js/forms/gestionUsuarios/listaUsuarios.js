import '/resources/css/forms/gestionUsuarios/listaUsuarios.css';

export default function initListaUsuarios(container = document.querySelector('.lu-wrapper')) {
  if (!container) return;

  const usuarios = [
    { nombre: 'Juan Pérez', contraseña: '1234', rol: 'admin' },
    { nombre: 'María García', contraseña: 'abcd', rol: 'profesor' },
    { nombre: 'Carlos Ruiz', contraseña: 'qwerty', rol: 'admin' },
    { nombre: 'Lucía Torres', contraseña: 'prof2024', rol: 'profesor' }
  ];

  // UI refs
  const selectRol       = container.querySelector('#selectRol');
  const buscador        = container.querySelector('#buscador');
  const sugerenciasDiv  = container.querySelector('#sugerenciasNombres');
  const tbody           = container.querySelector('#tablaUsuarios tbody');

  // Limpiar sugerencias
  const limpiarSugerencias = () => {
    sugerenciasDiv.innerHTML = '';
  };

  // Generar lista de nombres para sugerencias
  const generarNombres = () => usuarios.map(u => u.nombre);

  // Mostrar sugerencias según el texto
  const mostrarSugerencias = () => {
    limpiarSugerencias();
    const term = buscador.value.trim().toLowerCase();
    if (!term) return;

    generarNombres()
      .filter(nombre => nombre.toLowerCase().includes(term))
      .forEach(nombre => {
        const div = document.createElement('div');
        div.textContent = nombre;
        div.addEventListener('click', () => {
          buscador.value = nombre;
          limpiarSugerencias();
          renderUsuarios({ porNombre: nombre });
        });
        sugerenciasDiv.appendChild(div);
      });
  };

  // Renderizar tabla con filtro por rol (y opcionalmente por nombre)
  const renderUsuarios = ({ porNombre = null } = {}) => {
    const rol = selectRol.value.toLowerCase();
    tbody.innerHTML = '';

    // Sólo filtramos por rol, o por nombre si viene de la sugerencia
    const filtrados = usuarios.filter(u => {
      const okRol = !rol || u.rol === rol;
      const okNombre = porNombre
        ? u.nombre === porNombre
        : true;
      return okRol && okNombre;
    });

    filtrados.forEach(usuario => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${usuario.nombre}</td>
        <td>${usuario.rol}</td>
        <td><span class="pass-mask" data-real="${usuario.contraseña}">••••••</span></td>
        <td><button type="button" class="ver-btn">Ver</button></td>
      `;

      // Toggle contraseña
      const btn = tr.querySelector('.ver-btn');
      const span = tr.querySelector('.pass-mask');
      btn.addEventListener('click', () => {
        const visible = span.textContent !== '••••••';
        span.textContent = visible ? '••••••' : span.dataset.real;
        btn.textContent = visible ? 'Ver' : 'Ocultar';
      });

      tbody.appendChild(tr);
    });
  };

  // Cuando cambias de rol: limpiamos el buscador y recargamos sólo por rol
  selectRol.addEventListener('change', () => {
    buscador.value = '';
    limpiarSugerencias();
    renderUsuarios();
  });

  // El buscador solo muestra sugerencias; NO recarga la tabla al tipear
  buscador.addEventListener('input', mostrarSugerencias);
  buscador.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

  // Carga inicial: sólo por rol (que al inicio es vacío => todos)
  renderUsuarios();
}
