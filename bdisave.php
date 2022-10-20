<?php

$FILE_LOC = "bdi_saved.json";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo("POST");
    if(isset($_POST["save"])) {
        $toSave = $_POST["save"];
        
        $ret = file_put_contents($FILE_LOC, $toSave);
    }
    else if(isset($_POST["delete"])) {
        unlink($FILE_LOC);
    }
}

else {
    if (isset($_GET["load"])) {
        if(file_exists($FILE_LOC)) {
            // Load some data
            $fileCt = file_get_contents($FILE_LOC);
            
            if($fileCt !== false)
                echo($fileCt);
            else
                echo("");
        }
        else {
            echo("");
        }
    }
    else {
        echo("GET");
    }
}

?>
