import html from './crearUsuarios.html?raw';
import styles from './crearUsuarios.css?inline';

class CrearUsuarios extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    /* ─────────────────── Datos de ejemplo ─────────────────── */
    const profesores = [
      { nombre: 'Juan Pérez', grado: '1ro' },
      { nombre: 'María García', grado: '1ro' },
      { nombre: 'Ana Gómez',   grado: '2do' },
      { nombre: 'Pedro Díaz',  grado: '3ro' },
      { nombre: 'Lucía Torres',grado: '3ro' },
      { nombre: 'Carlos Ruiz', grado: '4to' }
    ];
    /* ───────────────────────── UI ─────────────────────────── */
    const rolSel      = this.shadowRoot.getElementById('rolUsuario');
    const gradoLab    = this.shadowRoot.getElementById('gradoLabel');
    const gradoSel    = this.shadowRoot.getElementById('gradoUsuario');
    const buscadorInp = this.shadowRoot.getElementById('buscadorNombre');
    const sugerDiv    = this.shadowRoot.getElementById('sugerenciasNombres');
    const inputNombre = this.shadowRoot.getElementById('inputNombre');
    
    const passInp     = this.shadowRoot.getElementById('inputPassword');
    const form        = this.shadowRoot.getElementById('formularioCrearUsuario');
    const mensajeP    = this.shadowRoot.getElementById('mensaje');

    /* ────────────────── Helpers ────────────────── */
    const limpiarSugerencias = () => (sugerDiv.innerHTML = '');

    const generarListaNombres = () => {
      if (rolSel.value !== 'profesor') return [];
      const grado = gradoSel.value;
      return profesores
        .filter(p => !grado || p.grado === grado)
        .map(p => p.nombre);
    };

    const mostrarSugerencias = () => {
      const texto = buscadorInp.value.trim().toLowerCase();
      limpiarSugerencias();
      if (!texto) return;

      const lista = generarListaNombres().filter(n =>
        n.toLowerCase().includes(texto)
      );

      lista.forEach(nombre => {
        const div = document.createElement('div');
        div.textContent = nombre;
        div.addEventListener('click', () => {
          buscadorInp.value = nombre;
          inputNombre.value = nombre;
          limpiarSugerencias();
        });
        sugerDiv.appendChild(div);
      });
    };

    /* ─────────────── Eventos UI ─────────────── */
    rolSel.addEventListener('change', () => {
      if (rolSel.value === 'profesor') {
        gradoLab.classList.remove('oculto');
      } else {
        gradoLab.classList.add('oculto');
        gradoSel.value = '';
      }
      mostrarSugerencias();          // reajustar lista
    });

    gradoSel.addEventListener('change', mostrarSugerencias);
    buscadorInp.addEventListener('input', mostrarSugerencias);
    buscadorInp.addEventListener('blur', () => setTimeout(limpiarSugerencias, 150));

    /* ─────────────── Submit ─────────────── */
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const dataUsuario = {
        usuario: inputNombre.value.trim(),          // o un campo separado
        nombres: inputNombre.value.trim(),
        
        password: passInp.value,
        rol: rolSel.value,
        grado: rolSel.value === 'profesor' ? gradoSel.value : null
      };

      console.log('Usuario creado:', dataUsuario);
      mensajeP.textContent = '✅ Usuario registrado correctamente.';
      mensajeP.style.color = 'green';

      form.reset();
      gradoLab.classList.add('oculto');
      setTimeout(() => (mensajeP.textContent = ''), 3000);
    });
  }
}

customElements.define('crear-usuarios', CrearUsuarios);
