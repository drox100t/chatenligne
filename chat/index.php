<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <title>Connexion</title>
</head>
<body>
    <div class="center">
        <h1>Bienvenue sur le Chat</h1>
        <form action="backend/connect.php" method="POST">
            <input type="text" name="pseudo" placeholder="Ton pseudo" autocomplete="off" required><br />
            <button type="submit">Se connecter</button>
        </form>
    </div>
</body>
</html>
