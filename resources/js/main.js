console.log("LLEGADA 1");

document.addEventListener("DOMContentLoaded", () => {
  inicializarSidebar(); // <--- ¡IMPORTANTE!

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

// Inicializar sidebar y manejar formularios dinámicos
function inicializarSidebar() {
  const toggleBtn = document.getElementById("header-toggle");
  const nav = document.getElementById("navbar");

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggleBtn.classList.toggle("bx-x");
    });
  }

  // Botones con atributo data-form
  document.querySelectorAll("[data-form]").forEach(link => {
    link.addEventListener("click", async function (e) {
      e.preventDefault();
      const formTag = this.getAttribute("data-form"); // Ej: "matricula-form"
      const container = document.getElementById("form-container");

      if (container && formTag) {
        container.innerHTML = ""; // Limpia el contenedor

        try {
          await cargarFormularioJS(formTag); // Carga el archivo .js correspondiente
          const formComponent = document.createElement(formTag);
          container.appendChild(formComponent);
        } catch (error) {
          console.error(`Error al cargar el formulario ${formTag}:`, error);
        }
      }
    });
  });
}

// Función para importar dinámicamente el JS del formulario
async function cargarFormularioJS(formTag) {
  switch (formTag) {
    case "matricula-form":
      return import('./forms/matricula/matricula.js');

    case "lista-matriculas":
      return import('./forms/matricula/listaMatriculas.js');

    case "registro-alumnos":
      return import('./forms/asistencia/registroAlumnos.js');

    case "historial-asistencia":
      return import('./forms/asistencia/historialAsistencia.js');

    case "registro-docente":
      return import('./forms/asistencia/registroDocente.js');

    case "registro-notas":
      return import('./forms/notas/registroNotas.js');

    case "lista-notas":
      return import('./forms/notas/listaNotas.js');

    case "pago-mensual":
      return import('./forms/pagos/pagoMensual.js');

    case "historial-pagos":
      return import('./forms/pagos/historialPagos.js');

    case "agregar-profesores":
      return import('./forms/profesores/agregarProfesores.js');

    case "lista-profesores":
      return import('./forms/profesores/listaProfesores.js');

    case "crear-usuarios":
      return import('./forms/gestionUsuarios/crearUsuarios.js');

    case "lista-usuarios":
      return import('./forms/gestionUsuarios/listaUsuarios.js');

    default:
      throw new Error(`No se reconoce el formulario: ${formTag}`);
  }
}
