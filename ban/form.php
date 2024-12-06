<?php 
    require_once 'config.php';

    // On récupere les données dans la table utilisateurs et ban
    $user = $bdd->query('SELECT * FROM utilisateurs ORDER BY pseudo');
    $ban = $bdd->query('SELECT * FROM utilisateurs ORDER BY pseudo');
?>
<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            <title>Bannir</title>
        </head>
        <body>
            <br />
            <div class="container-fluid">
                <div class="d-flex justify-content-around">
                    <div class="form-group w-20 text-center">
                        <h2 class="p-3">Bannir</h2>
                        <form action="ban.php" method="POST">
                            <select name="token" class="form-control">
                                <?php 
                                    // On affiche les données des utilisateurs non banni
                                    while($data = $user->fetch())
                                    {
                                ?>
                                    <option value="<?php echo $data['pseudo'].";".$data['email'].";".$data['token'];?>"><?php echo $data['pseudo']; ?></option>
                                <?php 
                                    }
                                ?>
                            </select>
                            <br />
                            <button type="submit" class="btn btn-success">Bannir</button>
                        </form>
                    </div>
                    <div class="form-group w-20 text-center">
                        <h2 class="p-3">Révoquer</h2>
                        <form action="unban.php" method="POST">
                            <select name="token" class="form-control">
                                <?php 
                                    // On affiche les personnes qui ont été banni
                                    while($data = $ban->fetch())
                                    {
                                ?>
                                    <option value="<?php echo $data['token']; ?>"><?php echo $data['pseudo']; ?></option>
                                <?php 
                                    }
                                ?>
                            </select>
                            <br />
                            <button type="submit" class="btn btn-success">Révoquer</button>
                        </form>
                    </div>
                </div>
            </div>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <style>.w-20{width: 20%;}</style>
    </body>
</html>
