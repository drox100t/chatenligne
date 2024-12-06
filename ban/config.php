<?php 
    // Connexion à la bdd via PDO dans un try catch
    try
    {
        $bdd = new PDO('mysql:host=localhost;dbname=site;charset=utf8', 'root', '');
    }catch(\Exception $e) 
    {
         die($e->getMessage());
    }