@extends('layouts.app')

@section('title', 'Inicio')

@section('content')
  <section>
    <div id="form-container">
      {{-- Aquí irá la bienvenida sólo cuando entres a “Inicio” --}}
      <div class="welcome-wrapper">
        <h1 class="welcome-text">
          ¡Bienvenido al Sistema Escolar – IEP La Católica!
        </h1>
      </div>
    </div>
  </section>
@endsection
