<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'Sistema Escolar')</title>

    <!-- Iconos -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css">

    <!-- Estilos con Vite -->
    @vite(['resources/css/styles.css', 'resources/js/main.js'])
</head>
<body>
    <!-- Header -->
    @include('components.header')

    <div class="container">
        <!-- Sidebar -->
        @include('components.sidebar')

        <!-- Contenido principal -->
        <main class="main-content">
            @yield('content')
            
            <!-- Footer -->
            @include('components.footer')
        </main>
    </div>
</body>
</html>
