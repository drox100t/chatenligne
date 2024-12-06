<?php 
    require_once(__DIR__ . '/vendor/autoload.php');
    use \Mailjet\Resources;
    define('API_PUBLIC_KEY', 'a9e478a8f67ba12cfa506c3c0c6608d0');
    define('API_PRIVATE_KEY', 'dd4c2783bd3229114535824736467446');
    $mj = new \Mailjet\Client(API_PUBLIC_KEY, API_PRIVATE_KEY,true,['version' => 'v3.1']);


    if(!empty($_POST['surname']) && !empty($_POST['firstname']) && !empty($_POST['email']) && !empty($_POST['message'])){
        $surname = htmlspecialchars($_POST['surname']);
        $firstname = htmlspecialchars($_POST['firstname']);
        $email = htmlspecialchars($_POST['email']);
        $message = htmlspecialchars($_POST['message']);

        if(filter_var($email, FILTER_VALIDATE_EMAIL)){
        $body = [
            'Messages' => [
            [
                'From' => [
                    'Email' => "jawishjan@gmail.com",
                    'Name' => "Trafalgar"
                ],
                'To' => [
                [
                    'Email' => "trafwhitehat@proton.me",
                    'Name' => "Trafalgar"
                ]
                ],
                'Subject' => "Questions ?",
                'TextPart' => '$email, $message', 
                'CustomID' => "AppGettingStartedTest"
            ]
            ]
        ];
            $response = $mj->post(Resources::$Email, ['body' => $body]);
            $response->success();
            echo "Merci pour ton avis, je vasi te repondre, promis !";
        }
        else{
            echo "Email pas bon fdp";
        }

    } else {
        header('Location: index.php');
        die();
    }
