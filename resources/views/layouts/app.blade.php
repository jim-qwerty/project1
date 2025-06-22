<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title', 'Sistema Escolar')</title>

  <!-- Iconos -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css">

  <!-- CSS + JS de tu app, incluida la vista de notas -->
  @vite([
    'resources/css/styles.css',
    'resources/js/main.js',
    'resources/js/forms/notas/listaNotas.js'
  ])

  {{-- html2pdf.js para generar el PDF --}}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
</head>
<body>
  <!-- Header siempre visible -->
  @include('components.header')

  <div class="container">
    @auth
      <!-- Sidebar sólo si está autenticado -->
      @include('components.sidebar')
    @endauth

    <!-- Contenido principal -->
    <main class="main-content">
      @yield('content')
    </main>
  </div>

  @auth
    <!-- Footer sólo si está autenticado -->
    @include('components.footer')
  @endauth
</body>
</html>
