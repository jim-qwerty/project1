

document.addEventListener("DOMContentLoaded", () => {
  inicializarSidebar();

  const sidebar = document.getElementById("sidebar");
  const container = document.querySelector(".container");

  if (sidebar && container) {
    sidebar.addEventListener("mouseenter", () => {
      container.classList.add("sidebar-expanded");
    });

    sidebar.addEventListener("mouseleave", () => {
      container.classList.remove("sidebar-expanded");
    });
  }
});

function inicializarSidebar() {
  const toggleBtn = document.getElementById("header-toggle");
  const nav = document.getElementById("navbar");

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggleBtn.classList.toggle("bx-x");
    });
  }

  // DE LA DERECHA SON LAS RUTAS .blade.php (vistas) EN CADA CARPETA
  const rutasFormularios = {
    "matricula-form": { path: "matricula", file: "matricula" },
    "lista-matriculas": { path: "matricula", file: "listaMatriculas" },
    

    "registro-notas": { path: "notas", file: "registroNotas" },
    "lista-notas": { path: "notas", file: "listaNotas" },

    "historial-asistencia": { path: "asistencia", file: "historialAsistencia" },
    "registro-alumnos": { path: "asistencia", file: "registroAlumnos" },
    "registro-docente": { path: "asistencia", file: "registroDocente" },

    "pago-mensual": { path: "pagos", file: "pagoMensual" },
    "historial-pagos": { path: "pagos", file: "historialPagos" },

    "crear-usuarios": { path: "gestionUsuarios", file: "crearUsuarios" },
    "lista-usuarios": { path: "gestionUsuarios", file: "listaUsuarios" },

    "agregar-docentes": { path: "docentes", file: "agregarDocentes" },
    "lista-docentes": { path: "docentes", file: "listaDocentes" },

    "asignar-secciones": { path: "grado", file: "listaDocentes" },

    "indexMenuPrincipal": { path: "menu", file: "indexMenuPrincipal" },
  };

  

  document.querySelectorAll("[data-form]").forEach(link => {
    link.addEventListener("click", async function (e) {
      e.preventDefault();

      const formTag = this.getAttribute("data-form");
      const config = rutasFormularios[formTag];
      const container = document.getElementById("form-container");

      if (!config || !container) {
        console.warn(`Ruta no definida para: ${formTag}`);
        return;
      }

      const { path: formType, file: fileName } = config;

      // Visualmente activo
      document.querySelectorAll("[data-form]").forEach(el => el.classList.remove("active"));
      this.classList.add("active");

      container.innerHTML = "<p>Cargando formulario...</p>";


      
      try {
        const response = await fetch(`/forms/${formType}/${fileName}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const html = await response.text();
        container.innerHTML = html;

        
        try {
          
          const modulo = await import(`./forms/${formType}/${fileName}.js`);
          
          if (typeof modulo.default === "function") {
            modulo.default(container);
            
          }


          
        } catch (modErr) {
          console.warn(`No se encontró JS para ${formTag}:`, modErr.message);
        }

      } catch (error) {
        container.innerHTML = `<p>Error al cargar el formulario: ${formTag}</p>`;
        console.error(error);
      }
    });
  });
}
