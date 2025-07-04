{{-- resources/views/components/sidebar.blade.php --}}
<div class="nav" id="navbar">
  <nav class="nav__container">
    <div>
      {{-- Logo --}}
      <a href="{{ route('home') }}" class="nav__link nav__logo">
        <i class='bx bxs-disc nav__icon'></i>
        <span class="nav__logo-name">La Católica</span>
      </a>

      {{-- Perfil --}}
      @push('styles')
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
      @endpush

      <div class="profile-card">
        <div class="circle">
          <i class='bx bx-user'></i>
        </div>
        <div class="role">
          {{ ucfirst(Auth::user()->rol) }}
        </div>
      </div>

      {{-- Menú principal --}}
      <div class="nav__list">

        {{-- PROFESOR --}}
        @if(Auth::user()->rol === 'profesor' || Auth::user()->rol === 'admin')
          <div class="nav__items">
            <h3 class="nav__subtitle">PROFESOR</h3>

            <a href="#" class="nav__link active" data-form="indexMenuPrincipal">
              <i class='bx bx-home nav__icon'></i>
              <span class="nav__name">Menú Principal</span>
            </a>

            {{-- Asistencia --}}
            <div class="nav__dropdown">
              <a href="#" class="nav__link">
                <i class='bx bx-calendar-check nav__icon'></i>
                <span class="nav__name">Asistencia</span>
                <i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>
              </a>
              <div class="nav__dropdown-collapse">
                <div class="nav__dropdown-content">
                  <a href="#" class="nav__dropdown-item" data-form="registro-alumnos">Registro de alumnos</a>
                  <a href="#" class="nav__dropdown-item" data-form="historial-asistencia">Historial</a>
                  <a href="#" class="nav__dropdown-item" data-form="registro-docente">Registro de docentes</a>
                </div>
              </div>
            </div>

            {{-- Notas --}}
            <div class="nav__dropdown">
              <a href="#" class="nav__link">
                <i class='bx bx-book-open nav__icon'></i>
                <span class="nav__name">Notas</span>
                <i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>
              </a>
              <div class="nav__dropdown-collapse">
                <div class="nav__dropdown-content">
                  <a href="#" class="nav__dropdown-item" data-form="registro-notas">Registro de notas</a>
                  <a href="#" class="nav__dropdown-item" data-form="lista-notas">Reporte de notas</a>
                </div>
              </div>
            </div>
          </div>
        @endif

        {{-- ADMINISTRADOR --}}
        @if(Auth::user()->rol === 'admin')
          <div class="nav__items">
            <h3 class="nav__subtitle">ADMINISTRADOR</h3>

            {{-- Matrículas --}}
            <div class="nav__dropdown">
              <a href="#" class="nav__link">
                <i class='bx bx-id-card nav__icon'></i>
                <span class="nav__name">Matrículas</span>
                <i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>
              </a>
              <div class="nav__dropdown-collapse">
                <div class="nav__dropdown-content">
                  <a href="#" class="nav__dropdown-item" data-form="matricula-form">Registro de Matrícula</a>
                  <a href="#" class="nav__dropdown-item" data-form="lista-matriculas">Lista de matriculados</a>
                </div>
              </div>
            </div>

            {{-- Pagos --}}
            <div class="nav__dropdown">
              <a href="#" class="nav__link">
                <i class='bx bx-credit-card nav__icon'></i>
                <span class="nav__name">Pagos</span>
                <i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>
              </a>
              <div class="nav__dropdown-collapse">
                <div class="nav__dropdown-content">
                  <a href="#" class="nav__dropdown-item" data-form="pago-mensual">Pago mensual</a>
                  <a href="#" class="nav__dropdown-item" data-form="historial-pagos">Historial de pagos</a>
                </div>
              </div>
            </div>

            {{-- Profesores --}}
            <div class="nav__dropdown">
              <a href="#" class="nav__link">
                <i class='bx bx-user nav__icon'></i>
                <span class="nav__name">Profesores</span>
                <i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>
              </a>
              <div class="nav__dropdown-collapse">
                <div class="nav__dropdown-content">
                  <a href="#" class="nav__dropdown-item" data-form="agregar-docentes">Agregar</a>
                  <a href="#" class="nav__dropdown-item" data-form="lista-docentes">Lista</a>
                </div>
              </div>
            </div>

            {{-- Gestión de usuarios --}}
            <div class="nav__dropdown">
              <a href="#" class="nav__link">
                <i class='bx bx-user-circle nav__icon'></i>
                <span class="nav__name">Gestión de usuarios</span>
                <i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>
              </a>
              <div class="nav__dropdown-collapse">
                <div class="nav__dropdown-content">
                  <a href="#" class="nav__dropdown-item" data-form="crear-usuarios">Agregar</a>
                  <a href="#" class="nav__dropdown-item" data-form="lista-usuarios">Lista</a>
                </div>
              </div>
            </div>
          </div>
        @endif
      </div>
    </div>

    {{-- Logout --}}
    <a href="#" class="nav__link nav__logout"
       onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
      <i class='bx bx-log-out nav__icon'></i>
      <span class="nav__name">Salir</span>
    </a>
    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none;">
      @csrf
    </form>
  </nav>
</div>
