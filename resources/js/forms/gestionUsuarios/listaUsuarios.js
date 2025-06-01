import html from '/forms/gestionUsuarios/listaUsuarios.html?raw';
import styles from '/forms/gestionUsuarios/listaUsuarios.css?inline';

class ListaUsuarios extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const usuarios = [
      { nombre: 'Juan Pérez', contraseña: '1234', rol: 'admin' },
      { nombre: 'María García', contraseña: 'abcd', rol: 'profesor' },
      { nombre: 'Carlos Ruiz', contraseña: 'qwerty', rol: 'admin' },
      { nombre: 'Lucía Torres', contraseña: 'prof2024', rol: 'profesor' }
    ];

    const selectRol = this.shadowRoot.getElementById('selectRol');
    const buscador = this.shadowRoot.getElementById('buscador');
    const tbody = this.shadowRoot.querySelector('#tablaUsuarios tbody');

    const renderUsuarios = () => {
      const rol = selectRol.value.toLowerCase();
      const texto = buscador.value.toLowerCase();

      tbody.innerHTML = '';

      const filtrados = usuarios.filter(usuario => {
        const coincideRol = !rol || usuario.rol === rol;
        const coincideTexto = usuario.nombre.toLowerCase().includes(texto);
        return coincideRol && coincideTexto;
      });

      for (const usuario of filtrados) {
        const fila = document.createElement('tr');

        const passwordCell = document.createElement('td');
        const passwordSpan = document.createElement('span');
        passwordSpan.textContent = '••••••';
        passwordSpan.dataset.real = usuario.contraseña;
        passwordSpan.dataset.visible = 'false';
        passwordCell.appendChild(passwordSpan);

        const actionCell = document.createElement('td');
        const btnVer = document.createElement('button');
        btnVer.type = 'button';
        btnVer.textContent = 'Ver';
        btnVer.classList.add('ver-btn');
        btnVer.addEventListener('click', () => {
          const isVisible = passwordSpan.dataset.visible === 'true';
          passwordSpan.textContent = isVisible ? '••••••' : passwordSpan.dataset.real;
          passwordSpan.dataset.visible = !isVisible;
          btnVer.textContent = isVisible ? 'Ver' : 'Ocultar';
        });

        actionCell.appendChild(btnVer);

        fila.innerHTML = `
          <td>${usuario.nombre}</td>
          <td>${usuario.rol}</td>
        `;
        fila.appendChild(passwordCell);
        fila.appendChild(actionCell);
        tbody.appendChild(fila);
      }
    };

    selectRol.addEventListener('change', renderUsuarios);
    buscador.addEventListener('input', renderUsuarios);

    renderUsuarios();
  }
}

customElements.define('lista-usuarios', ListaUsuarios);
