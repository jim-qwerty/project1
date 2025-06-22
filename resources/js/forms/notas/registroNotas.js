import '/resources/css/forms/notas/registroNotas.css';
import { initGradosSecciones, poblarSelect } from '../utils/loadGradosSecciones.js';

export default async function initRegistroNotas(container = document.querySelector('.rn-wrapper')) {
  if (!container) return;

  // 1) Referencias al DOM
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
  const csrfToken      = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // 2) Almacenar lista original de alumnos
  let originalAlumnos = [];
  let idxActual = 0;

  // 3) Datos estáticos
  const cursosEstaticos = [
    { id: 1, nombre: 'Matemática' },
    { id: 2, nombre: 'Comunicación' },
    { id: 3, nombre: 'Ciencia y Tecnología' },
    { id: 4, nombre: 'Personal Social' },
    { id: 5, nombre: 'Educación Física' }
  ];
  const bimestresEstaticos = [
    { id: 'I',   nombre: 'I° Bimestre' },
    { id: 'II',  nombre: 'II° Bimestre' },
    { id: 'III', nombre: 'III° Bimestre' },
    { id: 'IV',  nombre: 'IV° Bimestre' }
  ];

  // 4) Inicializar grados y secciones
  try {
    await initGradosSecciones(gradoSelect, seccionSelect, 'Grado', 'Sección');
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    mensaje.textContent = '❌ No se pudieron cargar grados o secciones.';
    return;
  }

  // 5) Poblar cursos y bimestres
  poblarSelect(cursoSelect,    cursosEstaticos,    'Seleccione curso');
  poblarSelect(bimestreSelect, bimestresEstaticos, 'Seleccione bimestre');

  // 6) Helper para fetch que espera JSON
  async function fetchJSON(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) throw new Error(`Error en fetch ${url}: ${res.status}`);
    return res.json();
  }

  // 7) Cargar alumnos de la BD
  async function fetchAlumnosBD() {
    const data = await fetchJSON('/alumnos/filtrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        grado_id:   +gradoSelect.value,
        seccion_id: +seccionSelect.value
      })
    });
    return data.map(a => ({ id: a.id, nombre_completo: a.nombre_completo }));
  }

  // 8) Cargar notas existentes
  async function fetchNotasBD() {
    const params = new URLSearchParams({
      grado_id:   gradoSelect.value,
      seccion_id: seccionSelect.value,
      curso_id:   cursoSelect.value,
      bimestre:   bimestreSelect.value
    });
    return fetchJSON(`/notas/filtrar?${params}`);
  }

  // 9) Renderizar tabla de alumnos y sus notas
  async function cargarAlumnos() {
    tbody.innerHTML        = '';
    resultadosUl.innerHTML = '';
    mensaje.textContent    = '';
    idxActual = 0;

    if (!(gradoSelect.value && seccionSelect.value && cursoSelect.value && bimestreSelect.value)) {
      return;
    }

    try {
      // Obtener alumnos y notas
      const alumnos = await fetchAlumnosBD();
      originalAlumnos = alumnos;
      const notas   = await fetchNotasBD();

      alumnos.forEach((al, i) => {
        const obj = notas.find(n => n.alumno_id === al.id) || {};
        const tr  = document.createElement('tr');
        tr.dataset.id = al.id;
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${al.nombre_completo}</td>
          ${['competencia1','competencia2','competencia3','nota_final'].map((campo, idx) => `
            <td>
              <div class="rn-radio-group">
                ${['A','B','C'].map(val => `
                  <label>
                    <input
                      type="radio"
                      name="${campo}[${i}]"
                      value="${val}"
                      ${obj[campo] === val ? 'checked' : ''}
                    >${val}
                  </label>
                `).join('')}
              </div>
            </td>
          `).join('')}
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error en cargarAlumnos:', err);
    }
  }

  // 10) Búsqueda de alumnos por nombre
  buscarInput.addEventListener('input', () => {
    const term = buscarInput.value.trim().toLowerCase();
    resultadosUl.innerHTML = '';
    if (!term) {
      cargarAlumnos();
      return;
    }
    const lista = Array.from(tbody.rows).map(r => ({
      id:     +r.dataset.id,
      nombre: r.cells[1].textContent
    }));
    lista
      .filter(a => a.nombre.toLowerCase().includes(term))
      .forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.nombre;
        li.onclick = () => {
          tbody.innerHTML = '';
          cargarAlumnos().then(() => {
            Array.from(tbody.rows)
              .filter(r => +r.dataset.id !== a.id)
              .forEach(r => r.remove());
          });
        };
        resultadosUl.appendChild(li);
      });
  });

  // 11) Navegar entre alumnos
  btnSiguiente.addEventListener('click', async () => {
    let rows = Array.from(tbody.rows);
    if (!rows.length) return;

    if (rows.length === 1 && originalAlumnos.length > 1) {
      const currentId = +rows[0].dataset.id;
      const origIndex = originalAlumnos.findIndex(a => a.id === currentId);
      await cargarAlumnos();
      rows = Array.from(tbody.rows);
      idxActual = (origIndex + 1) % rows.length;
      rows.forEach((r, i) => r.style.display = i === idxActual ? '' : 'none');
    } else {
      idxActual = (idxActual + 1) % rows.length;
      rows.forEach((r, i) => r.style.display = i === idxActual ? '' : 'none');
    }
  });

  // 12) Guardar notas
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const rows = Array.from(tbody.rows);
    const notas = rows.map((r, i) => ({
      alumno_id:    +r.dataset.id,
      grado_id:     +gradoSelect.value,
      seccion_id:   +seccionSelect.value,
      curso_id:     +cursoSelect.value,
      bimestre:     bimestreSelect.value,
      competencia1: r.querySelector(`input[name="competencia1[${i}]"]:checked`)?.value,
      competencia2: r.querySelector(`input[name="competencia2[${i}]"]:checked`)?.value,
      competencia3: r.querySelector(`input[name="competencia3[${i}]"]:checked`)?.value,
      nota_final:   r.querySelector(`input[name="nota_final[${i}]"]:checked`)?.value
    }))
    .filter(n =>
      n.competencia1 &&
      n.competencia2 &&
      n.competencia3 &&
      n.nota_final
    );

    if (!notas.length) {
      mensaje.textContent = '❌ Debes completar al menos una nota para guardar.';
      return;
    }

    try {
      await fetchJSON('/notas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ notas })
      });
      mensaje.textContent = '✅ Notas guardadas correctamente';
    } catch (err) {
      mensaje.textContent = '❌ Error al guardar notas';
      console.error('Error al guardar notas:', err);
    }
  });

  // 13) Recargar tabla al cambiar filtros
  [gradoSelect, seccionSelect, cursoSelect, bimestreSelect]
    .forEach(el => el.addEventListener('change', cargarAlumnos));
}

document.addEventListener('DOMContentLoaded', () => initRegistroNotas());
