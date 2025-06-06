import '/resources/css/forms/asistencia/historialAsistencia.css';

export default function initHistorialAsistencia(container = document.querySelector('.ha-wrapper')) {
  if (!container) return;

  const mesInput      = container.querySelector('#mes');
  const nombreInput   = container.querySelector('#nombreAlumno');
  const gradoInput    = container.querySelector('#grado');
  const seccionInput  = container.querySelector('#seccion');
  const tablaCont     = container.querySelector('#tablaResumen');
  const suggestions   = container.querySelector('#suggestions');

  // 1) Mes actual y header de la tabla (solo lunes a viernes)
  const hoy       = new Date();
  const yyyy      = hoy.getFullYear();
  const mm        = String(hoy.getMonth()+1).padStart(2,'0');
  mesInput.value  = `${yyyy}-${mm}`;

  const monthIdx  = hoy.getMonth();
  const diasMes   = new Date(yyyy, monthIdx+1, 0).getDate();
  const weekDays  = [];
  for (let d=1; d<=diasMes; d++){
    const fd = new Date(yyyy, monthIdx, d).getDay();
    if (fd>=1 && fd<=5) weekDays.push(d);
  }

  function crearHeader(){
    let html = `<table><thead><tr><th>Alumno</th>`;
    for(const d of weekDays){
      html += `<th style="width:25px;">${d}</th>`;
    }
    html += `</tr></thead><tbody></tbody></table>`;
    tablaCont.innerHTML = html;
  }
  crearHeader();

  // 2) Simula API de alumnos
  async function obtenerAlumnos(grado, seccion){
    const todos = [
      { id:1, nombre:'Ana Torres',   grado:'1', seccion:'A' },
      { id:2, nombre:'Luis Pérez',    grado:'2', seccion:'B' },
      { id:3, nombre:'María López',   grado:'1', seccion:'A' },
      // ...
    ];
    return todos.filter(a => a.grado===grado && a.seccion===seccion);
  }

  let alumnosCache = [];

  // 3) Al cambiar grado/sección recargamos alumnosCache
  async function cargarAlumnos(){
    const g = gradoInput.value.trim(),
          s = seccionInput.value.trim();
    if(!g||!s){
      alumnosCache=[];
      suggestions.innerHTML='';
      renderFilas();
      return;
    }
    alumnosCache = await obtenerAlumnos(g,s);
    renderFilas();
  }
  gradoInput.addEventListener('change', cargarAlumnos);
  seccionInput.addEventListener('change', cargarAlumnos);

  // 4) Actualiza tabla de filas filtrando por nombreInput
  function renderFilas(){
    const term = nombreInput.value.trim().toLowerCase();
    const tbody = tablaCont.querySelector('tbody');
    tbody.innerHTML='';

    const filtrados = term
      ? alumnosCache.filter(a=>a.nombre.toLowerCase().includes(term))
      : alumnosCache;

    if(filtrados.length===0){
      tbody.innerHTML = `<tr><td colspan="${weekDays.length+1}">No hay datos</td></tr>`;
      return;
    }

    for(const al of filtrados){
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="nombre">${al.nombre}</td>`;
      for(let i=0;i<weekDays.length;i++){
        tr.innerHTML += `<td data-estado="">–</td>`;
      }
      tbody.appendChild(tr);
    }
  }

  // 5) Mostrar sugerencias al escribir
  function updateSuggestions(){
    const term = nombreInput.value.trim().toLowerCase();
    suggestions.innerHTML='';
    if(!term) return;
    const matches = alumnosCache.filter(a=>a.nombre.toLowerCase().includes(term));
    for(const m of matches){
      const li = document.createElement('li');
      li.textContent = m.nombre;
      li.addEventListener('click', ()=>{
        nombreInput.value = m.nombre;
        suggestions.innerHTML = '';
        renderFilas();
      });
      suggestions.appendChild(li);
    }
  }
  nombreInput.addEventListener('input', ()=>{
    updateSuggestions();
    renderFilas();
  });

  // 6) Cerrar sugerencias al clicar fuera
  document.addEventListener('click', e=>{
    if(!container.contains(e.target)){
      suggestions.innerHTML='';
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=> initHistorialAsistencia());
