<?php 
    require_once 'config.php';

    // La fonction check_ban va vérifier si la personne est banni ou non
    // Fonction a implementer dans votre connexion 
    // On vérifie via le token
    function check_ban($token, $bdd)
    {
      // On vérifie si le "token" est présent dans la table
      $check = $bdd->prepare('SELECT token FROM utilisateurs WHERE token = ?');
      $check->execute([$token]);
      $row = $check->rowCount();

      // Ternaire équivaut à : if($row > 0){ return true;}else{return false;}
      return $row > 0 ? true : false;
    }

    // On regarde ce que renvoie la fonction 
    // Modifiez token par le token de la personne sinon cela ne va pas fonctionner 
    // J'ai ajouté en paramètre la variable de la bdd sinon il mettait une erreur de variable non déclarée 
    // Ahlala .. portée des variables quand tu nous tiens ..
    var_dump(check_ban('token', $bdd));