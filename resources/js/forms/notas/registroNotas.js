// resources/js/forms/notas/registroNotas.js
import '/resources/css/forms/notas/registroNotas.css';

export default function initRegistroNotas(container = document.querySelector('.rn-wrapper')) {
  if (!container) return;

  // Referencias del DOM
  const gradoInput    = container.querySelector('#gradoSelect');
  const seccionInput  = container.querySelector('#seccionSelect');
  const cursoSelect   = container.querySelector('#cursoSelect');
  const bimestreInput = container.querySelector('#bimestreSelect');
  const buscarInput   = container.querySelector('#buscarAlumno');
  const resultadosUl  = container.querySelector('#listaResultados');
  const tbody         = container.querySelector('.rn-tabla tbody');
  const btnSiguiente  = container.querySelector('#btnSiguiente');
  const form          = container.querySelector('#formularioNotas');
  const mensaje       = container.querySelector('#mensajeConfirmacion');

  // Datos simulados por grado-sección
  const alumnosPorGradoSeccion = {
    '1-A': ['Pedro Garcia', 'Maria Torres', 'Pedro Ramirez'],
    '1-B': ['Luis Fernandez', 'Ana Lopez'],
    '2-A': ['Carlos Ruiz', 'Lucia Vargas'],
    '2-B': ['Pedro Martinez', 'Valeria Gomez'],
    '3-A': ['Diego Vega', 'Fernanda Nuñez'],
    '3-B': ['Sofia Mendoza', 'Andres Salas'],
  };

  let alumnos = [];        // array actual de alumnos
  let alumnoActual = '';   // nombre del alumno seleccionado
  let indiceAlumno = 0;    // índice del alumnoActual

  // 1) Al iniciar: solo limpio el tbody (table header ya está en el HTML)
  tbody.innerHTML = '';

  // 2) Función helper para generar las celdas de radios
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

  // 3) Cargar y renderizar filas solo cuando todo esté seleccionado
  function cargarAlumnos() {
    const g   = gradoInput.value.trim();
    const s   = seccionInput.value.trim();
    const c   = cursoSelect.value;
    const b   = bimestreInput.value;
    const key = `${g}-${s}`;

    // obtengo el array correspondiente o vacío
    alumnos = alumnosPorGradoSeccion[key] || [];
    indiceAlumno = 0;
    alumnoActual = '';
    mensaje.textContent = '';
    resultadosUl.innerHTML = '';

    // limpio siempre el tbody
    tbody.innerHTML = '';

    // solo populamos si todos los selects/inputs tienen valor y hay alumnos
    if (g && s && c && b && alumnos.length) {
      alumnos.forEach((nombre, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td>${nombre}</td>
          ${competenciasHTML(idx)}
        `;
        tbody.appendChild(tr);
      });
      // dejamos seleccionado el primero
      alumnoActual = alumnos[0];
    }
  }

  // 4) Buscar sugerencias (no toca la tabla)
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

  // 5) Mostrar una sola fila para el alumno clicado
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

  // 6) Avanzar al siguiente alumno
  function siguienteAlumno() {
    if (!alumnos.length) return;
    indiceAlumno = (indiceAlumno + 1) % alumnos.length;
    mostrarAlumno(alumnos[indiceAlumno]);
  }

  // 7) Registrar notas (simulado)
  function registrarNotas(e) {
    e.preventDefault();
    if (!alumnoActual) return;
    mensaje.textContent = `✅ Notas registradas para ${alumnoActual}.`;
  }

  // Listeners de los selects/inputs
  gradoInput    .addEventListener('change', cargarAlumnos);
  seccionInput  .addEventListener('change', cargarAlumnos);
  cursoSelect   .addEventListener('change', cargarAlumnos);
  bimestreInput .addEventListener('change', cargarAlumnos);

  buscarInput   .addEventListener('input', buscarAlumno);
  btnSiguiente  .addEventListener('click', siguienteAlumno);
  form          .addEventListener('submit', registrarNotas);
}

// Inicializar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initRegistroNotas());
