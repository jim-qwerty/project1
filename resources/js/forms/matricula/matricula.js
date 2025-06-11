// resources/js/forms/matricula/matricula.js

import '/resources/css/forms/matricula/matricula.css';
import axios from 'axios';

export default function initMatriculaForm(container = document.getElementById('form-container')) {
  const wrapper = container.querySelector('.m-wrapper');
  if (!wrapper) return;

  // CSRF
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.content;

  // Dom refs
  const form            = wrapper.querySelector('#matricula-form');
  const fechaNacimiento = wrapper.querySelector('#fecha-nacimiento');
  const edadInput       = wrapper.querySelector('#edad');
  const nivelSelect     = wrapper.querySelector('#nivel-educativo');
  const gradoSelect     = wrapper.querySelector('#grado');
  const seccionSelect   = wrapper.querySelector('#seccion');
  const mensajeBox      = wrapper.querySelector('#mensaje');
  const confirmBox      = wrapper.querySelector('#confirmacion');
  const btnSi           = wrapper.querySelector('#btn-si');
  const btnNo           = wrapper.querySelector('#btn-no');
  const confirmMsg      = wrapper.querySelector('#confirmacion-mensaje');

  // Datos estáticos
  const gradosPorNivel = {
    Inicial: [
      { id:1,nombre:'3 años' },
      { id:2,nombre:'4 años' },
      { id:3,nombre:'5 años' }
    ],
    Primaria: [
      { id:4,nombre:'Primero' },
      { id:5,nombre:'Segundo' },
      { id:6,nombre:'Tercero' },
      { id:7,nombre:'Cuarto' },
      { id:8,nombre:'Quinto' },
      { id:9,nombre:'Sexto' }
    ]
  };
  const secciones = [
    { id:1,nombre:'A' },
    { id:2,nombre:'B' },
    { id:3,nombre:'C' }
  ];
  secciones.forEach(s=>{
    seccionSelect.insertAdjacentHTML(
      'beforeend',
      `<option value="${s.id}">${s.nombre}</option>`
    );
  });

  // util
  const mostrarMensaje = txt => {
    mensajeBox.textContent=txt;
    mensajeBox.style.display='block';
    setTimeout(()=>mensajeBox.style.display='none',4000);
  };
  const confirmar = txt => new Promise(res=>{
    confirmBox.style.display='flex';
    confirmMsg.textContent = txt;
    btnSi.onclick = ()=>{ confirmBox.style.display='none'; res(true); };
    btnNo.onclick = ()=>{ confirmBox.style.display='none'; res(false); };
  });

  // edad
  fechaNacimiento?.addEventListener('change', ()=>{
    const birth = new Date(fechaNacimiento.value),
          today = new Date();
    let age = today.getFullYear()-birth.getFullYear();
    const m = today.getMonth()-birth.getMonth();
    if(m<0||(m===0&&today.getDate()<birth.getDate())) age--;
    edadInput.value = isNaN(age)?'':age;
  });

  // cargar grados
  nivelSelect?.addEventListener('change', ()=>{
    const nivel = nivelSelect.value;
    gradoSelect.innerHTML = '<option value="">Seleccione grado</option>';
    (gradosPorNivel[nivel]||[]).forEach(g=>{
      gradoSelect.insertAdjacentHTML(
        'beforeend',
        `<option value="${g.id}">${g.nombre}</option>`
      );
    });
  });

  // leer datos
  const leerDatosAlumno = () => {
    const get = sel => wrapper.querySelector(sel)?.value||null;
    const sexoRaw = Array.from(wrapper.querySelectorAll('input[name="sexo"]'))
                     .find(i=>i.checked)?.value||'';
    return {
      nombres:get('input[placeholder="Ingrese nombres"]'),
      apellidos:get('input[placeholder="Ingrese apellidos"]'),
      dni:get('input[placeholder="Ingrese DNI"]'),
      fecha_nacimiento:get('#fecha-nacimiento'),
      edad:parseInt(get('#edad'))||null,
      sexo:sexoRaw.startsWith('M')?'M':'F',
      nivel_educativo:get('#nivel-educativo'),
      grado_id:get('#grado'),
      seccion_id:get('#seccion'),
      direccion:get('input[placeholder="Ingrese dirección"]'),
      estado_matricula:'matriculado'
    };
  };
  const leerDatosApoderado = alumno_id => {
    const get = sel => wrapper.querySelector(sel)?.value||null;
    return {
      alumno_id,
      nombres:get('input[placeholder="Ingrese nombres del apoderado"]'),
      apellidos:get('input[placeholder="Ingrese apellidos del apoderado"]'),
      dni:get('input[placeholder="Ingrese DNI del apoderado"]'),
      parentesco:get('input[placeholder="Padre, Madre, Tutor, etc."]'),
      celular:get('input[placeholder="Ingrese celular"]'),
      correo_electronico:get('input[type="email"]')
    };
  };

  // submit matrícula
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if(!await confirmar('¿Deseas procesar la matrícula?')) return;

    // captura valores antes de reset
    const nombreVal = wrapper.querySelector('input[placeholder="Ingrese nombres"]').value;
    const dniVal    = wrapper.querySelector('input[placeholder="Ingrese DNI"]').value;

    try {
      const { data: alumno } = await axios.post('/alumnos', leerDatosAlumno());
      await axios.post('/apoderados', leerDatosApoderado(alumno.id));
      mostrarMensaje('✅ Matrícula y apoderado guardados.');
      form.reset();

      // carga dinámica del pago sin recarga
      setTimeout(async ()=>{
        container.innerHTML = '<p>Cargando pago...</p>';
        try {
          // trae el fragmento Blade
          const res  = await fetch('/forms/matricula/pagoMatricula');
          const html = await res.text();
          container.innerHTML = html;

          // vuelca nombre y dni en pago
          container.querySelector('#resumen-nombre').value = nombreVal;
          container.querySelector('#resumen-dni').value    = dniVal;

          // inicializa su JS
          const pagoMod = await import('./pagoMatricula.js');
          if(typeof pagoMod.default==='function'){
            pagoMod.default(container);
          }
        } catch(err){
          console.error('Error cargando pago:',err);
          container.innerHTML = '<p>Error cargando pago.</p>';
        }
      },500);

    } catch(err){
      console.error(err);
      mostrarMensaje('❌ Error al guardar.');
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>initMatriculaForm());
