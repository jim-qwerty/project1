import '/resources/css/forms/notas/registroNotas.css'; // Asegúrate de que Vite procese este CSS

export default function initRegistroNotas(container = document.querySelector('registro-notas')) {
  if (!container) return;

  const gradoSelect = container.querySelector('#gradoSelect');
  const seccionSelect = container.querySelector('#seccionSelect');
  const cursoSelect = container.querySelector('#cursoSelect');
  const bimestreSelect = container.querySelector('#bimestreSelect');
  const panelNotas = container.querySelector('#panelNotas');
  const nombreAlumno = container.querySelector('#nombreAlumno');
  const buscarInput = container.querySelector('#buscarAlumno');
  const listaResultados = container.querySelector('#listaResultados');
  const form = container.querySelector('#formularioNotas');
  const mensaje = container.querySelector('#mensajeConfirmacion');
  const btnSiguiente = container.querySelector('#btnSiguiente');

  const alumnosPorGradoSeccion = {
    '1-A': ['Pedro Garcia', 'Maria Torres', 'Pedro Ramirez'],
    '1-B': ['Luis Fernandez', 'Ana Lopez'],
    '2-A': ['Carlos Ruiz', 'Lucia Vargas'],
    '2-B': ['Pedro Martinez', 'Valeria Gomez'],
    '3-A': ['Diego Vega', 'Fernanda Nuñez'],
    '3-B': ['Sofia Mendoza', 'Andres Salas'],
  };

  let alumnos = [];
  let alumnoActual = '';
  let indiceAlumno = 0;

  const cargarAlumnos = () => {
    const clave = `${gradoSelect.value}-${seccionSelect.value}`;
    alumnos = alumnosPorGradoSeccion[clave] || [];
    indiceAlumno = 0;

    if (gradoSelect.value && seccionSelect.value && cursoSelect.value && bimestreSelect.value && alumnos.length > 0) {
      alumnoActual = alumnos[indiceAlumno];
      nombreAlumno.textContent = alumnoActual;
      panelNotas.style.display = 'block';
    } else {
      alumnoActual = '';
      nombreAlumno.textContent = '---';
      panelNotas.style.display = 'none';
    }
  };

  const buscarAlumno = () => {
    const texto = buscarInput.value.trim().toLowerCase();
    listaResultados.innerHTML = '';

    if (texto === '') return;

    const coincidencias = alumnos.filter(nombre => nombre.toLowerCase().includes(texto));

    coincidencias.forEach(nombre => {
      const li = document.createElement('li');
      li.textContent = nombre;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        alumnoActual = nombre;
        nombreAlumno.textContent = nombre;
        indiceAlumno = alumnos.indexOf(nombre);
        listaResultados.innerHTML = '';
      });
      listaResultados.appendChild(li);
    });
  };

  const siguienteAlumno = () => {
    if (alumnos.length === 0) return;

    indiceAlumno = (indiceAlumno + 1) % alumnos.length;
    alumnoActual = alumnos[indiceAlumno];
    nombreAlumno.textContent = alumnoActual;

    const radios = container.querySelectorAll('input[type="radio"]');
    radios.forEach(r => r.checked = false);
  };

  const registrarNotas = (e) => {
    e.preventDefault();
    if (!alumnoActual) return;

    mensaje.textContent = `✅ Notas registradas para ${alumnoActual}.`;
  };

  gradoSelect.addEventListener('change', cargarAlumnos);
  seccionSelect.addEventListener('change', cargarAlumnos);
  cursoSelect.addEventListener('change', cargarAlumnos);
  bimestreSelect.addEventListener('change', cargarAlumnos);
  buscarInput.addEventListener('input', buscarAlumno);
  btnSiguiente.addEventListener('click', siguienteAlumno);
  form.addEventListener('submit', registrarNotas);
}
