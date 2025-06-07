// resources/js/forms/notas/listaNotas.js
import '/resources/css/forms/notas/listaNotas.css';

export default function initListaNotas(container = document.querySelector('.ln-wrapper')) {
  if (!container) return;

  const grado     = container.querySelector('#gradoSelect');
  const seccion   = container.querySelector('#seccionSelect');
  const curso     = container.querySelector('#cursoSelect');
  const bimestre  = container.querySelector('#bimestreSelect');
  const tabla     = container.querySelector('#tablaNotas table');
  const tbody     = tabla.querySelector('tbody');
  const btnReporte= container.querySelector('#btnReporte');
  const form      = container.querySelector('#formReporteNotas');

  // Datos simulados
  const datosNotas = {
    '1-A': [
      { nombre: 'Pedro García',    c1: 'A', c2: 'B', c3: 'A', final: 'A' },
      { nombre: 'María Torres',    c1: 'B', c2: 'B', c3: 'C', final: 'B' }
    ],
    '2-B': [
      { nombre: 'Luis Fernández',  c1: 'A', c2: 'A', c3: 'A', final: 'A' }
    ],
    // …otras combinaciones
  };

  // Renderiza el tbody según los cuatro filtros
  function mostrarTabla() {
    const key   = `${grado.value}-${seccion.value}`;
    const notas = datosNotas[key] || [];

    // Siempre limpio el tbody
    tbody.innerHTML = '';

    // Solo inyectar filas si los 4 campos están completos y hay datos
    if (grado.value && seccion.value && curso.value && bimestre.value && notas.length) {
      notas.forEach(n => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${n.nombre}</td>
          <td>${n.c1}</td>
          <td>${n.c2}</td>
          <td>${n.c3}</td>
          <td>${n.final}</td>
        `;
        tbody.appendChild(tr);
      });
      btnReporte.style.display = 'inline-block';
    } else {
      btnReporte.style.display = 'none';
    }
  }

  // Listeners: cada vez que cambie cualquiera de los 4 filtros, intentamos mostrar la tabla
  grado     .addEventListener('input',  mostrarTabla);
  seccion   .addEventListener('input',  mostrarTabla);
  curso     .addEventListener('change', mostrarTabla);
  bimestre  .addEventListener('change', mostrarTabla);

  // Generar reporte (simulado)
  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('📄 Reporte de notas generado correctamente.');
  });
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => initListaNotas());
