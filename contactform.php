<?php

if(isset($_POST['submit'])){
    $name = $_POST['name'];
    $message = $_POST['message'];
    $mailFrom = $_POST['mail'];

    $mailTo ="projekt.vencio@gmail.com";
    $headers ="From: ".$mailFrom;
    $txt = "E-Mail from".$name.".\n\n".$message;


    mail($mailTo,$txt,$headers);
    header("Location: index.php?mailsend");
}
