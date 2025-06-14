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
    { id: 2, nombre: 'B' }
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

  // Estado de los datos
  let alumnosData = []; // [{id, nombre_completo}]
  let alumnos = [];

  // 4) Helper para poblar un <select>
  function poblarSelect(selectEl, datos) {
    selectEl.innerHTML = '<option value="">Seleccionar</option>';
    datos.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.nombre;
      selectEl.appendChild(option);
    });
  }

  // 5) Poblamos los selects al iniciar
  poblarSelect(gradoSelect, gradosEstaticos);
  poblarSelect(seccionSelect, seccionesEstaticas);
  poblarSelect(cursoSelect, cursosEstaticos);
  poblarSelect(bimestreSelect, bimestresEstaticos);

  // 6) Generar HTML de radios con precarga de notas
  function competenciasHTML(idx, nota = {}) {
    return ['c1', 'c2', 'c3', 'final']
      .map(campo => {
        const key = campo === 'final'
          ? 'nota_final'
          : `competencia${campo.charAt(1)}`;
        return `
          <td>
            <div class="rn-radio-group">
              <label>
                <input
                  type="radio"
                  name="${campo}[${idx}]"
                  value="A"
                  ${nota[key] === 'A' ? 'checked' : ''}
                >A
              </label>
              <label>
                <input
                  type="radio"
                  name="${campo}[${idx}]"
                  value="B"
                  ${nota[key] === 'B' ? 'checked' : ''}
                >B
              </label>
              <label>
                <input
                  type="radio"
                  name="${campo}[${idx}]"
                  value="C"
                  ${nota[key] === 'C' ? 'checked' : ''}
                >C
              </label>
            </div>
          </td>`;
      })
      .join('');
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
    if (!res.ok) throw new Error('Error al cargar alumnos: ' + res.status);
    const data = await res.json();
    alumnosData = data.map(a => ({ id: a.id, nombre_completo: a.nombre_completo }));
    alumnos = alumnosData.map(a => a.nombre_completo);
  }

  // 8) Fetch notas guardadas según filtros
  async function fetchNotasBD() {
    const params = new URLSearchParams({
      grado_id: gradoSelect.value,
      seccion_id: seccionSelect.value,
      curso_id: cursoSelect.value,
      bimestre: bimestreSelect.value
    });
    const res = await fetch(`/notas/filtrar?${params}`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al cargar notas: ' + res.status);
    return res.json();
  }

  // 9) Renderizar tabla de alumnos y notas
  async function cargarAlumnos() {
    tbody.innerHTML = '';
    resultadosUl.innerHTML = '';
    mensaje.textContent = '';

    if (
      gradoSelect.value &&
      seccionSelect.value &&
      cursoSelect.value &&
      bimestreSelect.value
    ) {
      await fetchAlumnosBD();
      const notas = await fetchNotasBD();

      alumnos.forEach((nombre, idx) => {
        const alumno = alumnosData[idx];
        const notaObj = notas.find(n => n.alumno_id === alumno.id) || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td>${nombre}</td>
          ${competenciasHTML(idx, notaObj)}
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // 10) Buscar sugerencias de alumno
  function buscarAlumno() {
    const term = buscarInput.value.trim().toLowerCase();
    resultadosUl.innerHTML = '';
    if (!term) return;
    alumnos
      .filter(n => n.toLowerCase().includes(term))
      .forEach(nom => {
        const li = document.createElement('li');
        li.textContent = nom;
        li.onclick = () => mostrarAlumno(nom);
        resultadosUl.appendChild(li);
      });
  }

  // 11) Mostrar un solo alumno con su nota precargada
  function mostrarAlumno(nombre) {
    const idx = alumnos.indexOf(nombre);
    if (idx < 0) return;
    const alumno = alumnosData[idx];
    alumnos = [nombre];
    alumnosData = [alumno];
    const notaObj = {};
    // Podrías reusar fetchNotasBD para encontrar notaObj aquí
    tbody.innerHTML = `
      <tr>
        <td>1</td>
        <td>${nombre}</td>
        ${competenciasHTML(0, notaObj)}
      </tr>
    `;
  }

  // 12) Siguiente alumno
  function siguienteAlumno() {
    if (!alumnos.length) return;
    indiceAlumno = (indiceAlumno + 1) % alumnos.length;
    mostrarAlumno(alumnos[indiceAlumno]);
  }

  // 13) Enviar notas a la BD
  async function registrarNotas(e) {
    e.preventDefault();
    if (!alumnos.length) return;
    const payload = alumnos.map((_, i) => ({
      alumno_id:    alumnosData[i].id,
      grado_id:     parseInt(gradoSelect.value),
      seccion_id:   parseInt(seccionSelect.value),
      curso_id:     parseInt(cursoSelect.value),
      bimestre:     bimestreSelect.value,
      competencia1: document.querySelector(`input[name="c1[${i}]"]:checked`)?.value || null,
      competencia2: document.querySelector(`input[name="c2[${i}]"]:checked`)?.value || null,
      competencia3: document.querySelector(`input[name="c3[${i}]"]:checked`)?.value || null,
      nota_final:   document.querySelector(`input[name="final[${i}]"]:checked`)?.value || null
    }));

    try {
      const res = await fetch('/notas', {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ notas: payload })
      });
      if (!res.ok) throw new Error(await res.text());
      mensaje.textContent = '✅ Notas guardadas correctamente';
    } catch (error) {
      mensaje.textContent = '❌ Error al guardar notas';
      console.error('Error registrarNotas:', error);
    }
  }

  // 14) Listeners de eventos
  [gradoSelect, seccionSelect, cursoSelect, bimestreSelect].forEach(el =>
    el.addEventListener('change', cargarAlumnos)
  );
  buscarInput.addEventListener('input', buscarAlumno);
  btnSiguiente.addEventListener('click', siguienteAlumno);
  form.addEventListener('submit', registrarNotas);
}

// Inicializar al cargar DOM
document.addEventListener('DOMContentLoaded', initRegistroNotas);
