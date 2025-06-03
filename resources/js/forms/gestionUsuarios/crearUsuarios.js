import '/resources/css/forms/gestionUsuarios/crearUsuarios.css'; // Asegúrate que Vite lo procese

export default function initCrearUsuarios(container = document.querySelector('.crear-usuarios')) {
  if (!container) return;

  /* ─────────────────── Datos de ejemplo ─────────────────── */
  const profesores = [
    { nombre: 'Juan Pérez', grado: '1ro' },
    { nombre: 'María García', grado: '1ro' },
    { nombre: 'Ana Gómez', grado: '2do' },
    { nombre: 'Pedro Díaz', grado: '3ro' },
    { nombre: 'Lucía Torres', grado: '3ro' },
    { nombre: 'Carlos Ruiz', grado: '4to' }
  ];

  /* ───────────────────────── UI ─────────────────────────── */
  const rolSel = container.querySelector('#rolUsuario');
  const gradoLab = container.querySelector('#gradoLabel');
  const gradoSel = container.querySelector('#gradoUsuario');
  const buscadorInp = container.querySelector('#buscadorNombre');
  const sugerDiv = container.querySelector('#sugerenciasNombres');
  const inputNombre = container.querySelector('#inputNombre');
  const passInp = container.querySelector('#inputPassword');
  const form = container.querySelector('#formularioCrearUsuario');
  const mensajeP = container.querySelector('#mensaje');

  /* ────────────────── Helpers ────────────────── */
  const limpiarSugerencias = () => (sugerDiv.innerHTML = '');

  const generarListaNombres = () => {
    if (rolSel.value !== 'profesor') return [];
    const grado = gradoSel.value;
    return profesores
      .filter(p => !grado || p.grado === grado)
      .map(p => p.nombre);
  };

  const mostrarSugerencias = () => {
    const texto = buscadorInp.value.trim().toLowerCase();
    limpiarSugerencias();
    if (!texto) return;

    const lista = generarListaNombres().filter(n =>
      n.toLowerCase().includes(texto)
    );

    lista.forEach(nombre => {
      const div = document.createElement('div');
      div.textContent = nombre;
      div.addEventListener('click', () => {
        buscadorInp.value = nombre;
        inputNombre.value = nombre;
        limpiarSugerencias();
      });
      sugerDiv.appendChild(div);
    });
  };

  /* ─────────────── Eventos UI ─────────────── */
  rolSel.addEventListener('change', () => {
    if (rolSel.value === 'profesor') {
      gradoLab.classList.remove('oculto');
    } else {
      gradoLab.classList.add('oculto');
      gradoSel.value = '';
    }
    mostrarSugerencias();
  });

  gradoSel.addEventListener('change', mostrarSugerencias);
  buscadorInp.addEventListener('input', mostrarSugerencias);
  buscadorInp.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

  /* ─────────────── Submit ─────────────── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const dataUsuario = {
      usuario: inputNombre.value.trim(),
      nombres: inputNombre.value.trim(),
      password: passInp.value,
      rol: rolSel.value,
      grado: rolSel.value === 'profesor' ? gradoSel.value : null
    };

    console.log('Usuario creado:', dataUsuario);
    mensajeP.textContent = '✅ Usuario registrado correctamente.';
    mensajeP.style.color = 'green';

    form.reset();
    gradoLab.classList.add('oculto');
    setTimeout(() => (mensajeP.textContent = ''), 3000);
  });
}
