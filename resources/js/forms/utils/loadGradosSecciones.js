// resources/js/forms/utils/loadGradosSecciones.js

/**
 * Devuelve un array de grados [{id,nombre}, …]
 */
export async function fetchGrados() {
  const res = await fetch('/api/grados', {
    credentials: 'same-origin',
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('No se pudieron cargar los grados');
  return res.json();
}

/**
 * Devuelve un array de secciones [{id,nombre}, …]
 */
export async function fetchSecciones() {
  const res = await fetch('/api/secciones', {
    credentials: 'same-origin',
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('No se pudieron cargar las secciones');
  return res.json();
}

/**
 * Pone en un <select> los items pasados.
 * @param {HTMLSelectElement} sel 
 * @param {{id, nombre}[]} items 
 * @param {string} placeholder 
 */
export function poblarSelect(sel, items, placeholder = '--Selecciona--') {
  sel.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach(i => {
    const opt = document.createElement('option');
    opt.value       = i.id;
    opt.textContent = i.nombre;
    sel.appendChild(opt);
  });
}

/**
 * Inicializa ambos selects y devuelve una promesa que resuelve cuando están cargados.
 * @param {HTMLSelectElement} gradoSel 
 * @param {HTMLSelectElement} seccionSel 
 * @param {string} gradoPlaceholder 
 * @param {string} seccionPlaceholder 
 */
export async function initGradosSecciones(gradoSel, seccionSel,
                                           gradoPlaceholder = 'Grado',
                                           seccionPlaceholder = 'Sección') {
  const [grados, secciones] = await Promise.all([
    fetchGrados(),
    fetchSecciones()
  ]);
  poblarSelect(gradoSel,   grados,   `--Selecciona ${gradoPlaceholder}--`);
  poblarSelect(seccionSel, secciones, `--Selecciona ${seccionPlaceholder}--`);
}
