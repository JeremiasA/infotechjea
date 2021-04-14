const menu = document.getElementById('menu');
const menu_movil_links = document.querySelectorAll('menu_movil_links');

document.getElementById('menu_button').addEventListener('click', ()=>{
    if(menu.classList[1] == 'invisible'){
        menu.classList.remove('invisible');
    }else{ 
        menu.classList.add('invisible');
    }
})

    


