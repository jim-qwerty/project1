import '/resources/css/forms/notas/registroNotas.css';
import axios from 'axios';
import { initGradosSecciones, poblarSelect } from '../utils/loadGradosSecciones.js';

export default async function initRegistroNotas(container = document.querySelector('.rn-wrapper')) {
  if (!container) return;

  // 1) Referencias del DOM
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

  // 2) Datos estáticos para cursos y bimestres
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

  // 3) Inicializar selects de grados y secciones
  try {
    await initGradosSecciones(gradoSelect, seccionSelect, 'Grado', 'Sección');
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    mensaje.textContent = '❌ No se pudieron cargar grados o secciones.';
    return;
  }

  // 4) Helper para poblar cursos y bimestres
  poblarSelect(cursoSelect,    cursosEstaticos,    'Seleccione curso');
  poblarSelect(bimestreSelect, bimestresEstaticos, 'Seleccione bimestre');

  // 5) Opciones de fetch genérico
  async function fetchJSON(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json', ...options.headers },
      ...options
    });
    if (!res.ok) throw new Error(`Error en fetch ${url}: ${res.status}`);
    return res.json();
  }

  // 6) Fetch alumnos y notas de BD
  async function fetchAlumnosBD() {
    const data = await fetchJSON('/alumnos/filtrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        grado_id:   parseInt(gradoSelect.value, 10),
        seccion_id: parseInt(seccionSelect.value, 10)
      })
    });
    return data.map(a => ({ id: a.id, nombre_completo: a.nombre_completo }));
  }

  async function fetchNotasBD() {
    const params = new URLSearchParams({
      grado_id:   gradoSelect.value,
      seccion_id: seccionSelect.value,
      curso_id:   cursoSelect.value,
      bimestre:   bimestreSelect.value
    });
    return await fetchJSON(`/notas/filtrar?${params.toString()}`);
  }

  // 7) Renderizar tabla de alumnos con notas
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
      try {
        const alumnos = await fetchAlumnosBD();
        const notas   = await fetchNotasBD();

        alumnos.forEach((al, idx) => {
          const notaObj = notas.find(n => n.alumno_id === al.id) || {};
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${al.nombre_completo}</td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="c1[${idx}]" value="A" ${notaObj.competencia1==='A'?'checked':''}>A</label>
                <label><input type="radio" name="c1[${idx}]" value="B" ${notaObj.competencia1==='B'?'checked':''}>B</label>
                <label><input type="radio" name="c1[${idx}]" value="C" ${notaObj.competencia1==='C'?'checked':''}>C</label>
              </div>
            </td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="c2[${idx}]" value="A" ${notaObj.competencia2==='A'?'checked':''}>A</label>
                <label><input type="radio" name="c2[${idx}]" value="B" ${notaObj.competencia2==='B'?'checked':''}>B</label>
                <label><input type="radio" name="c2[${idx}]" value="C" ${notaObj.competencia2==='C'?'checked':''}>C</label>
              </div>
            </td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="c3[${idx}]" value="A" ${notaObj.competencia3==='A'?'checked':''}>A</label>
                <label><input type="radio" name="c3[${idx}]" value="B" ${notaObj.competencia3==='B'?'checked':''}>B</label>
                <label><input type="radio" name="c3[${idx}]" value="C" ${notaObj.competencia3==='C'?'checked':''}>C</label>
              </div>
            </td>
            <td>
              <div class="rn-radio-group">
                <label><input type="radio" name="final[${idx}]" value="A" ${notaObj.nota_final==='A'?'checked':''}>A</label>
                <label><input type="radio" name="final[${idx}]" value="B" ${notaObj.nota_final==='B'?'checked':''}>B</label>
                <label><input type="radio" name="final[${idx}]" value="C" ${notaObj.nota_final==='C'?'checked':''}>C</label>
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error('Error en cargarAlumnos:', err);
      }
    }
  }

  // 8) Sugerencias y navegación
  let alumnosList = [];
  buscarInput.addEventListener('input', () => {
    const term = buscarInput.value.trim().toLowerCase();
    resultadosUl.innerHTML = '';
    alumnosList = Array.from(tbody.querySelectorAll('tr')).map(tr => tr.children[1].textContent);
    alumnosList
      .filter(name => name.toLowerCase().includes(term))
      .forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.onclick = () => {
          tbody.innerHTML = '';
          const idx = alumnosList.indexOf(name);
          cargarAlumnos().then(() => {
            const rows = Array.from(tbody.querySelectorAll('tr'));
            rows.forEach((r, i) => { if (i !== idx) r.remove(); });
          });
        };
        resultadosUl.appendChild(li);
      });
  });

  let indiceAlumno = 0;
  btnSiguiente.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (!rows.length) return;
    indiceAlumno = (indiceAlumno + 1) % rows.length;
    rows.forEach((r,i) => { r.style.display = i === indiceAlumno ? '' : 'none'; });
  });

  // 9) Registrar notas en BD
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const payload = rows.map((tr, idx) => ({
      alumno_id:    alumnosList[idx]?.id,
      grado_id:     parseInt(gradoSelect.value, 10),
      seccion_id:   parseInt(seccionSelect.value, 10),
      curso_id:     parseInt(cursoSelect.value, 10),
      bimestre:     bimestreSelect.value,
      competencia1: tr.querySelector(`input[name="c1[${idx}]"]:checked`)?.value,
      competencia2: tr.querySelector(`input[name="c2[${idx}]"]:checked`)?.value,
      competencia3: tr.querySelector(`input[name="c3[${idx}]"]:checked`)?.value,
      nota_final:   tr.querySelector(`input[name="final[${idx}]"]:checked`)?.value
    }));
    try {
      await fetchJSON('/notas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ notas: payload })
      });
      mensaje.textContent = '✅ Notas guardadas correctamente';
    } catch (error) {
      mensaje.textContent = '❌ Error al guardar notas';
      console.error(error);
    }
  });

  // 10) Listeners de filtros
  [gradoSelect, seccionSelect, cursoSelect, bimestreSelect].forEach(el =>
    el.addEventListener('change', cargarAlumnos)
  );
}

document.addEventListener('DOMContentLoaded', () => initRegistroNotas());