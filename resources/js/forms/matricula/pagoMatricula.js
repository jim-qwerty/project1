// resources/js/forms/matricula/pagoMatricula.js

import '/resources/css/forms/matricula/pagoMatricula.css';
import axios from 'axios';

export default function initPagoForm(container = document.querySelector('.pago-wrapper')) {
  if (!container) return;

  const pagoForm    = container.querySelector('#pago-form');
  const btnRegresar = container.querySelector('#regresar-btn');
  const mensajeBox  = container.querySelector('#mensaje');
  const confirmBox  = container.querySelector('#confirmacion');
  const btnSi       = container.querySelector('#btn-si');
  const btnNo       = container.querySelector('#btn-no');
  const confirmMsg  = container.querySelector('#confirmacion-mensaje');

  // utilidades
  const mostrarMensaje = txt=>{
    if(!mensajeBox) return;
    mensajeBox.textContent=txt; mensajeBox.style.display='block';
    setTimeout(()=>mensajeBox.style.display='none',4000);
  };
  const confirmar = txt=>new Promise(res=>{
    confirmBox.style.display='flex'; confirmMsg.textContent=txt;
    btnSi.onclick=()=>{confirmBox.style.display='none';res(true)};
    btnNo.onclick=()=>{confirmBox.style.display='none';res(false)};
  });

  // envío pago
  pagoForm?.addEventListener('submit',async e=>{
    e.preventDefault(); if(!await confirmar('¿Confirmar pago?')) return;
    // Aquí podrías llamar a tu endpoint de pago:
    // await axios.post('/pagos', {...});
    mostrarMensaje('¡Pago exitoso!'); pagoForm.reset();
  });

  // regresar
  btnRegresar?.addEventListener('click',()=> window.history.back());
}

document.addEventListener('DOMContentLoaded',()=>initPagoForm());
