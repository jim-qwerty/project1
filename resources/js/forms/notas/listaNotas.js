// resources/js/forms/notas/listaNotas.js

import '/resources/css/forms/notas/listaNotas.css';
import { initGradosSecciones, poblarSelect, fetchGrados, fetchSecciones } from '../utils/loadGradosSecciones.js';

export default async function initListaNotas(container = document.querySelector('.ln-wrapper')) {
  if (!container) return;

  // 1) Referencias al DOM
  const gradoSelect    = container.querySelector('#gradoSelect');
  const seccionSelect  = container.querySelector('#seccionSelect');
  const cursoSelect    = container.querySelector('#cursoSelect');
  const bimestreSelect = container.querySelector('#bimestreSelect');
  const tablaCont      = container.querySelector('#tablaNotas');
  const tabla          = tablaCont.querySelector('table');
  const tbody          = tabla.querySelector('tbody');
  const btnReporte     = container.querySelector('#btnReporte');
  const csrfToken      = document.querySelector('meta[name="csrf-token"]').content;

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

  // 3) Carga dinámica de grados y secciones
  try {
    const [gradosBD, seccionesBD] = await Promise.all([
      fetchGrados(),
      fetchSecciones(),
    ]);
    poblarSelect(gradoSelect,   gradosBD,    'Todos los grados');
    poblarSelect(seccionSelect, seccionesBD, 'Todas las secciones');
  } catch (err) {
    console.error('Error cargando grados o secciones:', err);
    gradoSelect.innerHTML   = '<option value="">Error cargando grados</option>';
    seccionSelect.innerHTML = '<option value="">Error cargando secciones</option>';
  }

  // 4) Poblamos cursos y bimestres
  poblarSelect(cursoSelect,    cursosEstaticos,    'Todos los cursos');
  poblarSelect(bimestreSelect, bimestresEstaticos, 'Todos los bimestres');

  // 5) Fetch alumnos y notas
  async function fetchAlumnos() {
    const res = await fetch('/alumnos/filtrar', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        grado_id:   parseInt(gradoSelect.value, 10),
        seccion_id: parseInt(seccionSelect.value, 10)
      })
    });
    if (!res.ok) throw new Error('Error al cargar alumnos: ' + res.status);
    return res.json(); // [{id,nombre_completo}]
  }

  async function fetchNotas() {
    const params = new URLSearchParams({
      grado_id:   gradoSelect.value,
      seccion_id: seccionSelect.value,
      curso_id:   cursoSelect.value,
      bimestre:   bimestreSelect.value
    });
    const res = await fetch(`/notas/filtrar?${params}`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al cargar notas: ' + res.status);
    return res.json(); // [{alumno_id, competencia1, competencia2, competencia3, nota_final}]
  }

  // 6) Mostrar tabla con numeración
  async function mostrarTabla() {
    tbody.innerHTML = '';
    btnReporte.style.display = 'none';

    if (
      gradoSelect.value &&
      seccionSelect.value &&
      cursoSelect.value &&
      bimestreSelect.value
    ) {
      try {
        const alumnos = await fetchAlumnos();
        const notas   = await fetchNotas();

        alumnos.forEach((al, index) => {
          const notaObj = notas.find(n => n.alumno_id === al.id) || {};
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${al.nombre_completo}</td>
            <td>${notaObj.competencia1 || ''}</td>
            <td>${notaObj.competencia2 || ''}</td>
            <td>${notaObj.competencia3 || ''}</td>
            <td>${notaObj.nota_final   || ''}</td>
          `;
          tbody.appendChild(tr);
        });

        if (alumnos.length) {
          btnReporte.style.display = 'inline-block';
        }
      } catch (err) {
        console.error('Error mostrarTabla:', err);
      }
    }
  }

  // 7) Listeners de filtros
  [gradoSelect, seccionSelect, cursoSelect, bimestreSelect]
    .forEach(el => el.addEventListener('change', mostrarTabla));

  // 8) Generar PDF al hacer click
  btnReporte.addEventListener('click', () => {
    // El contenedor que queremos convertir a PDF
    const elemento = tablaCont;

    const opciones = {
      margin:       0.5,
      filename:     'reporte_notas.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opciones).from(elemento).save();
  });
}

// Inicialización al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initListaNotas());
