// resources/js/forms/matricula/pagoMatricula.js

import '/resources/css/forms/matricula/pagoMatricula.css';
import axios from 'axios';

export default function initPagoForm(container = document.querySelector('.pago-wrapper')) {
  if (!container) return;

  // Configurar CSRF para Axios
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.content;
  }

  // Referencias al DOM
  const pagoForm    = container.querySelector('#pago-form');
  const btnRegresar = container.querySelector('#regresar-btn');
  const mensajeBox  = container.querySelector('#mensaje');
  const confirmBox  = container.querySelector('#confirmacion');
  const btnSi       = container.querySelector('#btn-si');
  const btnNo       = container.querySelector('#btn-no');
  const confirmMsg  = container.querySelector('#confirmacion-mensaje');

  // Mostrar mensajes breves
  const mostrarMensaje = txt => {
    mensajeBox.textContent = txt;
    mensajeBox.style.display = 'block';
    setTimeout(() => mensajeBox.style.display = 'none', 4000);
  };

  // Modal de confirmación
  const confirmar = txt => new Promise(res => {
    confirmBox.style.display = 'flex';
    confirmMsg.textContent = txt;
    btnSi.onclick = () => { confirmBox.style.display = 'none'; res(true); };
    btnNo.onclick = () => { confirmBox.style.display = 'none'; res(false); };
  });

  // Envío del formulario de pago
  pagoForm?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!await confirmar('¿Confirmar pago?')) return;

    // Lee los campos del formulario
    const payload = {
      alumno_id:   window.alumnoParaPago,
      monto:       container.querySelector('input[type="number"]').value.trim(),
      metodo_pago: container.querySelector('select').value,
      fecha_pago:  container.querySelector('input[type="date"]').value,
      observacion: container.querySelector('input[placeholder="Detalles..."]').value.trim(),
      estado_pago: 'pagado'
    };

    console.log('Payload de pago a enviar:', payload);

    try {
      await axios.post('/matriculas', payload);
      mostrarMensaje('✅ Pago registrado con éxito!');
      pagoForm.reset();

      // ———> Aquí disparamos la carga de la vista de matrícula:
      const matriculaLink = document.querySelector('[data-form="matricula-form"]');
      if (matriculaLink) {
        // Simula el clic que muestra la vista matricula.blade.php
        matriculaLink.click();
      }

    } catch (err) {
      if (err.response?.status === 422) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        mostrarMensaje(`❌ ${firstError}`);
      } else {
        console.error('Error al registrar pago:', err);
        mostrarMensaje('❌ Error al registrar el pago.');
      }
    }
  });

  // Botón regresar
  btnRegresar?.addEventListener('click', () => {
    const matriculaLink = document.querySelector('[data-form="matricula-form"]');
    if (matriculaLink) matriculaLink.click();
  });
}

document.addEventListener('DOMContentLoaded', () => initPagoForm());
