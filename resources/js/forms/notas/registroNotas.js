import '/resources/css/forms/notas/registroNotas.css';

export default function initRegistroNotas(container = document.querySelector('.rn-wrapper')) {
  if (!container) return;

  // 1) Datos estáticos para los selects
  const gradosEstaticos = [
    { id: 1, nombre: '3 años' },
    { id: 2, nombre: '4 años' },
    { id: 3, nombre: '5 años' },
    { id: 4, nombre: 'Primero' },
    { id: 5, nombre: 'Segundo' },
    { id: 6, nombre: 'Tercero' },
    { id: 7, nombre: 'Cuarto' },
    { id: 8, nombre: 'Quinto' },
    { id: 9, nombre: 'Sexto' }
  ];
  const seccionesEstaticas = [
    { id: 1, nombre: 'A' },
    { id: 2, nombre: 'B' },
    { id: 3, nombre: 'C' }
  ];
  const cursosEstaticos = [
    { id: 1, nombre: 'Matemática' },
    { id: 2, nombre: 'Comunicación' },
    { id: 3, nombre: 'Ciencia y Tecnología' },
    { id: 4, nombre: 'Personal Social' },
    { id: 5, nombre: 'Educación Física' }
  ];
  const bimestresEstaticos = [
    { id: 'I', nombre: 'I° Bimestre' },
    { id: 'II', nombre: 'II° Bimestre' },
    { id: 'III', nombre: 'III° Bimestre' },
    { id: 'IV', nombre: 'IV° Bimestre' }
  ];

  // 2) Referencias del DOM
  const gradoSelect    = container.querySelector('#gradoSelect');
  const seccionSelect  = container.querySelector('#seccionSelect');
  const cursoSelect    = container.querySelector('#cursoSelect');
  const bimestreSelect = container.querySelector('#bimestreSelect');
  const buscarInput    = container.querySelector('#buscarAlumno');
  const resultadosUl   = container.querySelector('#listaResultados');
  const tbody          = container.querySelector('.rn-tabla tbody');
  const btnSiguiente   = container.querySelector('#btnSiguiente');
  const form           = container.querySelector('#formularioNotas');
  const mensaje        = container.querySelector('#mensajeConfirmacion');

  // 3) Token CSRF para peticiones
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  let alumnos = [];
  let alumnoActual = '';
  let indiceAlumno = 0;

  // 4) Función genérica para poblar un select
  function poblarSelect(selectEl, datos) {
    datos.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.nombre;
      selectEl.appendChild(opt);
    });
  }

  // 5) Poblamos todos los selects al inicio
  poblarSelect(gradoSelect, gradosEstaticos);
  poblarSelect(seccionSelect, seccionesEstaticas);
  poblarSelect(cursoSelect, cursosEstaticos);
  poblarSelect(bimestreSelect, bimestresEstaticos);

  // 6) Generador de celdas de radios
  function competenciasHTML(idx) {
    return ['c1','c2','c3','final']
      .map(campo => `
        <td>
          <div class="rn-radio-group">
            <label><input type="radio" name="${campo}[${idx}]" value="A">A</label>
            <label><input type="radio" name="${campo}[${idx}]" value="B">B</label>
            <label><input type="radio" name="${campo}[${idx}]" value="C">C</label>
          </div>
        </td>`)
      .join('');
  }

  // 7) Petición AJAX para traer alumnos de la BD según grado y sección
  async function fetchAlumnosBD() {
    try {
      const res = await fetch('/alumnos/filtrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({
          grado_id: gradoSelect.value,
          seccion_id: seccionSelect.value,
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      return data.map(a => a.nombre_completo);
    } catch (err) {
      console.error('Error al cargar alumnos:', err);
      return [];
    }
  }

  // 8) Cargar y renderizar filas solo cuando todo esté seleccionado
  async function cargarAlumnos() {
    const g = gradoSelect.value;
    const s = seccionSelect.value;
    const c = cursoSelect.value;
    const b = bimestreSelect.value;

    alumnoActual = '';
    indiceAlumno = 0;
    mensaje.textContent = '';
    resultadosUl.innerHTML = '';
    tbody.innerHTML = '';

    if (g && s && c && b) {
      alumnos = await fetchAlumnosBD();
      if (!alumnos.length) return;

      alumnos.forEach((nombre, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td>${nombre}</td>
          ${competenciasHTML(idx)}
        `;
        tbody.appendChild(tr);
      });
      alumnoActual = alumnos[0];
    }
  }

  // 9) Buscar sugerencias
  function buscarAlumno() {
    const term = buscarInput.value.trim().toLowerCase();
    resultadosUl.innerHTML = '';
    if (!term) return;

    alumnos
      .filter(n => n.toLowerCase().includes(term))
      .forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        li.addEventListener('click', () => {
          mostrarAlumno(nombre);
          resultadosUl.innerHTML = '';
          buscarInput.value = '';
        });
        resultadosUl.appendChild(li);
      });
  }

  // 10) Mostrar una sola fila para el alumno clicado
  function mostrarAlumno(nombre) {
    const idx = alumnos.indexOf(nombre);
    if (idx < 0) return;
    tbody.innerHTML = '';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${nombre}</td>
      ${competenciasHTML(idx)}
    `;
    tbody.appendChild(tr);
    alumnoActual = nombre;
  }

  // 11) Avanzar al siguiente alumno
  function siguienteAlumno() {
    if (!alumnos.length) return;
    indiceAlumno = (indiceAlumno + 1) % alumnos.length;
    mostrarAlumno(alumnos[indiceAlumno]);
  }

  // 12) Registrar notas (simulado)
  function registrarNotas(e) {
    e.preventDefault();
    if (!alumnoActual) return;
    mensaje.textContent = `✅ Notas registradas para ${alumnoActual}.`;
  }

  // 13) Listeners de eventos
  gradoSelect    .addEventListener('change', cargarAlumnos);
  seccionSelect  .addEventListener('change', cargarAlumnos);
  cursoSelect    .addEventListener('change', cargarAlumnos);
  bimestreSelect .addEventListener('change', cargarAlumnos);

  buscarInput    .addEventListener('input', buscarAlumno);
  btnSiguiente   .addEventListener('click', siguienteAlumno);
  form           .addEventListener('submit', registrarNotas);
}

// Inicializar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initRegistroNotas());
