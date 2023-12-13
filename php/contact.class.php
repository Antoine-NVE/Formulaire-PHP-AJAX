<?php
include_once "database.class.php";

class Contact
{
  private $nom;
  private $prenom;
  private $email;
  private $message;

  // Fonction d'insertion des données
  public function insert_contact($nom, $prenom, $email, $message)
  {
    $this->nom = $nom;
    $this->prenom = $prenom;
    $this->email = $email;
    $this->message = $message;

    $pdo = Database::connect();
    $sql = "INSERT INTO contact(nom, prenom, email, message) VALUES (:nom, :prenom, :email, :message)";
    $reponse = $pdo->prepare($sql);
    $reponse->bindParam(':nom',  $this->nom);
    $reponse->bindParam(':prenom', $this->prenom);
    $reponse->bindParam(':email', $this->email);
    $reponse->bindParam(':message', $this->message);
    $reponse->execute();
    Database::disconnect();
  }

  // Fonction de contrôles des données
  public function controles_validation($nom, $prenom, $email, $message)
  {
    $this->nom = $nom;
    $this->prenom = $prenom;
    $this->email = $email;
    $this->message = $message;

    $erreurs = array();

    // Nom (vide + regex)
    if (empty($this->nom)) {
      $erreurs["nom"] = "Veuillez saisir un nom";
    } elseif (!preg_match("/^[A-Z][A-Z ]{1,}$/", $this->nom)) {
      $erreurs["nom"] = "Veuillez saisir un nom valide";
    }

    // Prénom (vide + regex)
    if (empty($this->prenom)) {
      $erreurs["prenom"] = "Veuillez saisir un prénom";
    } elseif (!preg_match("/^[A-Z][a-z-]{1,}$/", $this->prenom)) {
      $erreurs["prenom"] = "Veuillez saisir un prénom valide";
    }

    // Email (vide + regex)
    if (empty($this->email)) {
      $erreurs["email"] = "Veuillez saisir un email";
    } elseif (!preg_match("/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/", $this->email)) {
      $erreurs["email"] = "Veuillez saisir un email valide";
    }

    // Message (vide)
    if (empty($this->message)) {
      $erreurs["message"] = "Veuillez saisir un message";
    }

    // Retourne un tableau d'erreurs, s'il y en a
    return $erreurs;
  }

  // Vérifie si cet exact formulaire a déjà été soumis précédemment
  public function controle_doublons($nom, $prenom, $email, $message)
  {
    $this->nom = $nom;
    $this->prenom = $prenom;
    $this->email = $email;
    $this->message = $message;

    $pdo = Database::connect();
    $sql = "SELECT * FROM contact WHERE nom = :nom AND prenom = :prenom AND email = :email AND message = :message";
    $reponse = $pdo->prepare($sql);
    $reponse->bindParam(':nom',  $this->nom);
    $reponse->bindParam(':prenom',  $this->prenom);
    $reponse->bindParam(':email',  $this->email);
    $reponse->bindParam(':message',  $this->message);
    $reponse->execute();
    Database::disconnect();

    // Retourne le formulaire déjà soumis, s'il existe
    return $reponse->fetch();
  }
}
