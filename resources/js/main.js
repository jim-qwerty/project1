// Importar Web Components desde rutas relativas (Vite compila desde 'resources/js')
import './forms/matricula/matricula.js';/*
import './forms/matricula/listaMatriculas.js';

import './forms/asistencia/registroAlumnos.js';
import './forms/asistencia/historialAsistencia.js';
import './forms/asistencia/registroDocente.js';

import './forms/notas/registroNotas.js';
import './forms/notas/listaNotas.js';

import './forms/pagos/pagoMensual.js';
import './forms/pagos/historialPagos.js';

import './forms/profesores/agregarProfesores.js';
import './forms/profesores/listaProfesores.js';

import './forms/gestionUsuarios/crearUsuarios.js';
import './forms/gestionUsuarios/listaUsuarios.js';*/

// Evento principal DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Cargar componentes dinámicos HTML
  cargarComponente('header', '/components/header.html');
  cargarComponente('sidebar', '/components/sidebar.html');
  cargarComponente('footer', '/components/footer.html'); // si lo usas

  // Sidebar hover animación
  const sidebar = document.getElementById("sidebar");
  const container = document.querySelector(".container");

  sidebar?.addEventListener("mouseenter", () => {
    container?.classList.add("sidebar-expanded");
  });

  sidebar?.addEventListener("mouseleave", () => {
    container?.classList.remove("sidebar-expanded");
  });
});

// Cargar fragmentos HTML (header, sidebar, footer)
function cargarComponente(id, url) {
  const contenedor = document.getElementById(id);
  if (!contenedor) return;

  fetch(url)
    .then(res => res.text())
    .then(html => {
      contenedor.innerHTML = html;

      if (id === 'sidebar') {
        inicializarSidebar(); // Reactivar eventos del sidebar
      }
    });
}

// Inicializar el sidebar: botón toggle y enlaces data-form
function inicializarSidebar() {
  const toggleBtn = document.getElementById("header-toggle");
  const nav = document.getElementById("navbar");

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggleBtn.classList.toggle("bx-x");
    });
  }

  // Manejo de clic en enlaces con atributo data-form
  document.querySelectorAll("[data-form]").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const formTag = this.getAttribute("data-form"); // Ej: "matricula-form"
      const container = document.getElementById("form-container");

      if (container && formTag) {
        container.innerHTML = "";
        const formComponent = document.createElement(formTag);
        container.appendChild(formComponent);
      }
    });
  });
}
