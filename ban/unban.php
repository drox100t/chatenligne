<?php 
    require_once 'config.php';

    // On vérifie si le champs token existe
    if(!empty($_POST['token'])){
        // Patch faille XSS
        $token = htmlspecialchars($_POST['token']);
        
        // On vérifie si l'utilisateur est banni
        $check_ban = $bdd->prepare('SELECT * FROM utilisateurs WHERE token = ?');
        $check_ban->execute([$token]);
        $row = $check_ban->rowCount();
        
        // Si il est banni
        if($row > 0)
        {
            // On enlève les données dans la table ban
            $unban = $bdd->prepare('DELETE FROM utilisateurs WHERE token = ?');
            $unban->execute([$token]);
            echo "L'utilisateur n'est plus banni ";
        }
        else // Sinon on affiche que l'utilisateur n'est pas banni
        {
            echo "L'utilisateur n'est pas banni";
        }
    }
    else // Si pas de champs token on redirige pour éviter une page blanche
    {
        header('Location: form.php');
        die();
    }
    