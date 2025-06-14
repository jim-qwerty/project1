<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Login – IEP La Católica</title>
    @vite(['resources/css/login/login.css', 'resources/js/login/login.js'])
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <div class="wrapper">
        <div class="title-text">
            <div class="title login">
                La Católica
            </div>
        </div>

        <div class="form-container">
            <div class="slide-controls">
                <label for="login" class="slide login">Login</label>
            </div>

            <div class="form-inner">
                <form action="{{ route('login') }}" method="POST" class="login">
                    @csrf

                    <div class="field">
                        <input
                          type="text"
                          name="username"
                          placeholder="Cuenta"
                          value="{{ old('username') }}"
                          required
                        >
                        @error('username')
                            <span class="error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="field">
                        <input
                          type="password"
                          name="password"
                          placeholder="Contraseña"
                          required
                        >
                        @error('password')
                            <span class="error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="field btn">
                        <div class="btn-layer"></div>
                        <input type="submit" value="Login">
                    </div>

                    @if($errors->has('username'))
                      <p class="error">{{ $errors->first('username') }}</p>
                    @endif
                </form>
            </div>
        </div>
    </div>
</body>
</html>
