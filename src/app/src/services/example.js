import View  from "./view.js";
import {route, template, router} from './routeur.js'

View.setWrapperTarget('wrapper');


//template('about', function(){
//    View.load('./partials/about');
//});

//route('/', 'home');

//route('/about', 'about');


template('home', function(){
    View.load('./partials/home');
});
route('/home', 'home');

addRoute('/home', function(){
    View.load('./partials/home');
});

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

