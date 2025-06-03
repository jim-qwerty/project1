

import '/resources/css/forms/pagos/pagoMensual.css';
console.log("PAGO MENSUAL")
export default function initPagoMensual(container = document.querySelector('pago-mensual')) {
  if (!container) return;

  const alumnosPorGradoSeccion = {
    '1-A': ['Pedro Garcia', 'Maria Torres', 'Pedro Ramirez'],
    '1-B': ['Luis Fernandez', 'Ana Lopez'],
    '2-A': ['Carlos Ruiz', 'Lucia Vargas'],
    '2-B': ['Pedro Martinez', 'Valeria Gomez'],
    '3-A': ['Diego Vega', 'Fernanda Nuñez'],
    '3-B': ['Sofia Mendoza', 'Andres Salas'],
  };

  const gradoSelect = container.querySelector('#gradoSelect');
  const seccionSelect = container.querySelector('#seccionSelect');
  const alumnoInput = container.querySelector('#alumnoInput');
  const listaCoincidencias = container.querySelector('#listaCoincidencias');
  const mensajePago = container.querySelector('#mensajePago');
  const form = container.querySelector('#formularioPagos');

  let alumnos = [];

  const actualizarAlumnosPorGradoSeccion = () => {
    const clave = `${gradoSelect.value}-${seccionSelect.value}`;
    alumnos = alumnosPorGradoSeccion[clave] || [];
    alumnoInput.value = '';
    listaCoincidencias.innerHTML = '';
  };

  const actualizarListaCoincidencias = () => {
    const textoIngresado = alumnoInput.value.trim().toLowerCase();
    listaCoincidencias.innerHTML = '';

    if (textoIngresado === '') return;

    const coincidencias = alumnos.filter(nombre =>
      nombre.toLowerCase().includes(textoIngresado)
    );

    coincidencias.forEach(nombre => {
      const li = document.createElement('li');
      li.textContent = nombre;
      li.addEventListener('click', () => {
        alumnoInput.value = nombre;
        listaCoincidencias.innerHTML = '';
      });
      listaCoincidencias.appendChild(li);
    });
  };

  alumnoInput.addEventListener('input', actualizarListaCoincidencias);
  gradoSelect.addEventListener('change', actualizarAlumnosPorGradoSeccion);
  seccionSelect.addEventListener('change', actualizarAlumnosPorGradoSeccion);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const alumno = alumnoInput.value.trim();
    if (alumno === '') return;
    mensajePago.textContent = `✅ Pago registrado para ${alumno}.`;
    listaCoincidencias.innerHTML = '';
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      listaCoincidencias.innerHTML = '';
    }
  });
}
