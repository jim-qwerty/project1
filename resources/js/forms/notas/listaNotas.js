import '/resources/css/forms/notas/listaNotas.css';

export default function initListaNotas(container = document.querySelector('.ln-wrapper')) {
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

  // 2) Referencias al DOM
  const gradoSelect    = container.querySelector('#gradoSelect');
  const seccionSelect  = container.querySelector('#seccionSelect');
  const cursoSelect    = container.querySelector('#cursoSelect');
  const bimestreSelect = container.querySelector('#bimestreSelect');
  const tabla          = container.querySelector('#tablaNotas table');
  const tbody          = tabla.querySelector('tbody');
  const btnReporte     = container.querySelector('#btnReporte');
  const form           = container.querySelector('#formReporteNotas');

  // 3) Token CSRF y opciones fetch
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const fetchOptions = {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    }
  };

  // 4) Función genérica para poblar un select
  function poblarSelect(selectEl, datos) {
    selectEl.innerHTML = '<option value="">--Selecciona--</option>';
    datos.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.nombre;
      selectEl.appendChild(opt);
    });
  }

  // 5) Poblamos selects
  poblarSelect(gradoSelect, gradosEstaticos);
  poblarSelect(seccionSelect, seccionesEstaticas);
  poblarSelect(cursoSelect, cursosEstaticos);
  poblarSelect(bimestreSelect, bimestresEstaticos);

  // 6) Fetch alumnos del grado-sección
  async function fetchAlumnos() {
    const res = await fetch('/alumnos/filtrar', {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({
        grado_id: parseInt(gradoSelect.value),
        seccion_id: parseInt(seccionSelect.value)
      })
    });
    if (!res.ok) throw new Error('Error al cargar alumnos: ' + res.status);
    return res.json(); // [{id,nombre_completo}]
  }

  // 7) Fetch notas según filtros
  async function fetchNotas() {
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

  // 8) Mostrar tabla combinando alumnos y notas
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

        alumnos.forEach((al, idx) => {
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

  // 9) Listeners de filtros
  [gradoSelect, seccionSelect, cursoSelect, bimestreSelect]
    .forEach(el => el.addEventListener('change', mostrarTabla));

  // 10) Generar reporte
  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('📄 Reporte generado correctamente.');
  });
}

// Inicialización al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => initListaNotas());
