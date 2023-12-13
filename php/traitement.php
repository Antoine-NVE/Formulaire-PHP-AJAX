<?php
require "contact.class.php";

$contact = new Contact();

// Fais les contrôles de validation sur les 4 champs
$erreurs = $contact->controles_validation($_POST["nom"], $_POST["prenom"], $_POST["email"], $_POST["message"]);

// Permet de savoir si l'insertion a été un succès
$reponse = ['success' => false];

// On vérifie qu'il n'y a pas eu d'erreurs
if (empty($erreurs)) {

  // On vérifie que le formulaire n'est pas déjà dans la base de données
  if (empty($contact->controle_doublons($_POST["nom"], $_POST["prenom"], $_POST["email"], $_POST["message"]))) {
    // Si non, on insère en base
    $contact->insert_contact($_POST["nom"], $_POST["prenom"], $_POST["email"], $_POST["message"]);
    $reponse = ['success' => true];
  }
}

echo json_encode($reponse);
