<?php 
session_start();
require_once 'chat.php';

// Vérification que le message est défini et que la session est active
if (!empty($_POST['msg']) && isset($_SESSION['user'])) {
    $msg = htmlspecialchars(trim($_POST['msg'])); // Nettoyage du message
    
    // Vérification de la longueur du message (limite à 500 caractères par exemple)
    if (strlen($msg) > 0 && strlen($msg) <= 500) {
        $chat = new Chat();
        $chat->setMessage($msg, $_SESSION['user']);
    } else {
        echo "Le message ne peut pas être vide ou dépasser 500 caractères.";
    }
    header('backend/chat.php');
    die();
} else {
    header('backend/chat.php');
    die();
}
