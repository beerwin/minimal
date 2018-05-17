(function(){
    "use strict";
    
    function toggleNavigation() {
        document.querySelector('body').classList.toggle('menu-open');
        document.querySelector('.main-menu').classList.toggle('menu-open');
    }
    
    document.querySelector('.toggle-nav').addEventListener('click', toggleNavigation);
})();
