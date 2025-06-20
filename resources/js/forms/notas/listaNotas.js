import '/resources/css/forms/notas/listaNotas.css';
import { initGradosSecciones, poblarSelect, fetchGrados, fetchSecciones } from '../utils/loadGradosSecciones.js';

export default async function initListaNotas(container = document.querySelector('.ln-wrapper')) {
  if (!container) return;

  // 1) Referencias al DOM
  const gradoSelect    = container.querySelector('#gradoSelect');
  const seccionSelect  = container.querySelector('#seccionSelect');
  const cursoSelect    = container.querySelector('#cursoSelect');
  const bimestreSelect = container.querySelector('#bimestreSelect');
  const tabla          = container.querySelector('#tablaNotas table');
  const tbody          = tabla.querySelector('tbody');
  const btnReporte     = container.querySelector('#btnReporte');
  const form           = container.querySelector('#formReporteNotas');
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

  // 3) Opciones de fetch genérico
  const fetchJSON = async url => {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
    return res.ok ? res.json() : [];
  };

  // 4) Cargar dinámicamente grados y secciones
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

  // 5) Poblamos otros selects
  poblarSelect(cursoSelect,    cursosEstaticos,   'Todos los cursos');
  poblarSelect(bimestreSelect, bimestresEstaticos, 'Todos los bimestres');

  // 6) Fetch alumnos y notas
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
        grado_id:   parseInt(gradoSelect.value),
        seccion_id: parseInt(seccionSelect.value)
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
    return res.json();
  }

  // 7) Mostrar tabla
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

        alumnos.forEach(al => {
          const notaObj = notas.find(n => n.alumno_id === al.id) || {};
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${al.nombre_completo}</td>
            <td>${notaObj.competencia1 || ''}</td>
            <td>${notaObj.competencia2 || ''}</td>
            <td>${notaObj.competencia3 || ''}</td>
            <td>${notaObj.nota_final   || ''}</td>
          `;
          tbody.appendChild(tr);
        });

        if (alumnos.length) btnReporte.style.display = 'inline-block';
      } catch (err) {
        console.error('Error mostrarTabla:', err);
      }
    }
  }

  // 8) Listeners de filtros
  [gradoSelect, seccionSelect, cursoSelect, bimestreSelect]
    .forEach(el => el.addEventListener('change', mostrarTabla));

  // 9) Generar reporte
  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('📄 Reporte generado correctamente.');
  });
}

// Inicialización al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initListaNotas());
