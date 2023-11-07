"use strict";

import View  from "./view.js";
import {route, template, router} from './routeur.js'

View.setWrapperTarget('listerrWrapper');

//template('about', function(){
//    View.load('./partials/about');
//});

route('/', 'registration');

//route('/about', 'about');


template('registration', function(){
    View.load('./user/registration');
});
route('/registration', 'registration');

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

