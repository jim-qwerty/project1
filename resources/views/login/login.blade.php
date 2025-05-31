<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Login</title>
   @vite(['resources/css/login/login.css', 'resources/js/login/login.js'])
    

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <div class="wrapper">
        <div class="title-text">
            <div class="title login">
                La Catolica
            </div>
        </div>

        <div class="form-container">
            <div class="slide-controls">
                <label for="login" class="slide login">Login</label>
            </div>

            <div class="form-inner">
                <form action="#" class="login">
                    <div class="field">
                        <input type="text" placeholder="Cuenta" required>
                    </div>
                    <div class="field">
                        <input type="password" placeholder="Contraseña" required>
                    </div>
                    <div class="field btn">
                        <div class="btn-layer"></div>
                        <input type="submit" value="Login">
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
