<?php

namespace Controllers;

use Models\Users;

Class UserController 
{
    // public function index(){ // pour afficher le compte utilisateur par ex
    //     return json_encode([
    //         'controller'=>'user', 
    //         'action'=>'index'
    //     ]);
    // }

    public function register(){
        try {
            if (!empty($_POST)){
                $params = $_POST;
                $params['role_id'] = 1;

                $model = new Users();
                $model->create($params);                
                return json_encode(['status'=>'success']);
            }

        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=>$e->getMessage()
            ]);
        }

        // quand on passe des éléments dans le formulaire
        // on récupère au moyen d'un $_POST les éléments et les mettre en base de données
        // hâcher le mdp avec une fonction qui s'appelle base64("mot de passe")
        // le retour de la fonction, avec un try catch
        // si ça catch on fait 
        // return json_encode(['status'=>'error'])
        // pour avoir un JSON dans tous les cas
    }

    public function login(){
        try {
            if (!empty($_POST)){
                $model = new Users();
                $user = $model->auth($_POST['login'], $_POST['password']);
                // si utilisateur vide alors retour status fail, sinon status success
                // donc 2ème if ici
                // si utilisateur pas vide, on lance la session
                return json_encode(['status'=>'success']);
            }
        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=> $e->getMessage()
            ]);
        }
    }

    public function loggout(){
        try {
            // si je suis connecté, je fais destructe
            return json_encode(['status'=>'disconnect', 
            'disconnected'=>'empty(session_id())']);

        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=>$e->getMessage()
            ]);
        }
    }

    public function update(){
        try {
            //code...
        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=>$e->getMessage()
            ]);
        }
    }

}