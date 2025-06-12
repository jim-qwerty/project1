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

  // 3) Token CSRF y configuración de fetch
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const fetchOptions = {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    }
  };

  // Estado
  let alumnosData = []; // [{id, nombre_completo}]
  let alumnos = [];     // [nombre]
  let alumnoActual = '';
  let indiceAlumno = 0;

  // 4) Helper para poblar selects
  function poblarSelect(sel, datos) {
    sel.innerHTML = '<option value="">Seleccionar</option>';
    datos.forEach(item => {
      const o = document.createElement('option');
      o.value = item.id;
      o.textContent = item.nombre;
      sel.appendChild(o);
    });
  }

  // 5) Poblamos todos los selects con datos estáticos
  poblarSelect(gradoSelect, gradosEstaticos);
  poblarSelect(seccionSelect, seccionesEstaticas);
  poblarSelect(cursoSelect, cursosEstaticos);
  poblarSelect(bimestreSelect, bimestresEstaticos);

  // 6) Generar HTML de radios
  function competenciasHTML(idx) {
    return ['c1','c2','c3','final']
      .map(campo =>
        `<td><div class="rn-radio-group">` +
          `<label><input type="radio" name="${campo}[${idx}]" value="A">A</label>` +
          `<label><input type="radio" name="${campo}[${idx}]" value="B">B</label>` +
          `<label><input type="radio" name="${campo}[${idx}]" value="C">C</label>` +
        `</div></td>`
      ).join('');
  }

  // 7) Fetch alumnos de la BD según grado y sección
  async function fetchAlumnosBD() {
    const res = await fetch('/alumnos/filtrar', {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({
        grado_id: parseInt(gradoSelect.value),
        seccion_id: parseInt(seccionSelect.value)
      })
    });
    if (!res.ok) throw new Error('Error cargando alumnos: ' + res.status);
    const data = await res.json();
    alumnosData = data.map(a => ({ id: a.id, nombre: a.nombre_completo }));
    return alumnosData.map(a => a.nombre);
  }

  // 8) Renderizar tabla de alumnos
  async function cargarAlumnos() {
    const g = gradoSelect.value, s = seccionSelect.value,
          c = cursoSelect.value, b = bimestreSelect.value;
    tbody.innerHTML = '';
    resultadosUl.innerHTML = '';
    mensaje.textContent = '';
    alumnos = [];

    if (g && s && c && b) {
      alumnos = await fetchAlumnosBD();
      alumnos.forEach((nom, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td>${nom}</td>${competenciasHTML(i)}`;
        tbody.appendChild(tr);
      });
      alumnoActual = alumnos[0];
    }
  }

  // 9) Búsqueda de alumno
  function buscarAlumno() {
    const term = buscarInput.value.trim().toLowerCase();
    resultadosUl.innerHTML = '';
    if (!term) return;

    alumnos.filter(n => n.toLowerCase().includes(term))
      .forEach(nom => {
        const li = document.createElement('li');
        li.textContent = nom;
        li.onclick = () => mostrarAlumno(nom);
        resultadosUl.appendChild(li);
      });
  }

  // 10) Mostrar sólo un alumno
  function mostrarAlumno(nom) {
    const idx = alumnos.indexOf(nom);
    if (idx < 0) return;
    alumnos = [nom];
    alumnosData = [alumnosData[idx]];
    tbody.innerHTML = `<tr><td>1</td><td>${nom}</td>${competenciasHTML(0)}</tr>`;
  }

  // 11) Siguiente alumno
  function siguienteAlumno() {
    if (!alumnos.length) return;
    indiceAlumno = (indiceAlumno + 1) % alumnos.length;
    mostrarAlumno(alumnos[indiceAlumno]);
  }

  // 12) Enviar notas a la BD
  async function registrarNotas(e) {
    e.preventDefault();
    if (!alumnos.length) return;
    const payload = alumnos.map((_, i) => ({
      alumno_id:    alumnosData[i].id,
      grado_id:     parseInt(gradoSelect.value),
      seccion_id:   parseInt(seccionSelect.value),
      curso_id:     parseInt(cursoSelect.value),
      bimestre:     bimestreSelect.value,
      competencia1: document.querySelector(`input[name="c1[${i}]"]:checked`).value,
      competencia2: document.querySelector(`input[name="c2[${i}]"]:checked`).value,
      competencia3: document.querySelector(`input[name="c3[${i}]"]:checked`).value,
      nota_final:   document.querySelector(`input[name="final[${i}]"]:checked`).value
    }));

    try {
      const res = await fetch('/notas', {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ notas: payload })
      });
      if (!res.ok) throw new Error(await res.text());
      mensaje.textContent = '✅ Notas guardadas correctamente';
    } catch (err) {
      mensaje.textContent = '❌ Error al guardar notas';
      console.error(err);
    }
  }

  // 13) Listeners
  [gradoSelect, seccionSelect, cursoSelect, bimestreSelect]
    .forEach(el => el.addEventListener('change', cargarAlumnos));
  buscarInput.addEventListener('input', buscarAlumno);
  btnSiguiente.addEventListener('click', siguienteAlumno);
  form.addEventListener('submit', registrarNotas);
}

// Inicializar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initRegistroNotas());
