<?php 
    require_once 'config.php';

    // Si le champ est vide
    if(!empty($_POST['token'])){
        // Patch XSS
        $tokenPost = htmlspecialchars($_POST['token']);

        // On explode la chaine $tokenPost soit 
        // [0] => pseudo
        // [1] => email 
        // [2] => token
        $tokenPost = explode(';', $tokenPost);
        $pseudo = $tokenPost[0];
        $email = $tokenPost[1];
        $token = $tokenPost[2];
        
        // On vérifie si la personne n'est pas déjà banni
        $check_ban = $bdd->prepare('SELECT * FROM utilisateurs WHERE token = ?');
        $check_ban->execute([$token]);
        $row = $check_ban->rowCount();
        
        // Si row == 0 (la requête n'a rien trouvé) il n'est donc pas banni
        if($row == 0)
        {
            // On insère les données dans la table ban
            $ban = $bdd->prepare('INSERT INTO utilisateurs(pseudo, email, token) VALUES(?,?,?)');
            $ban->execute([$pseudo, $email, $token]);
            echo "L'utilisateur $pseudo a bien été banni";
        }
        else  // Sinon on affiche qu'il est deja banni
        {
            echo "L'utilisateur est deja banni";
        }
    }
    else  // Si il n'y a aucune données on renvoie sur la page form.php pour éviter une page blanche
    {
        header('Location: form.php');
        die();
    }
    