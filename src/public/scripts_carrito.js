const cards = document.getElementById("cards");
const ruta = document.getElementById("ruta");
const header_h3 = document.getElementById("header_h3");
const header = document.getElementById("header");
const productos_carrito = document.getElementById("productos_carrito");
const containerCarrito = document.getElementById("containerCarrito");
const carrito = document.getElementById("carrito");
const fragment = document.createDocumentFragment();
const agregar_boton = document.querySelectorAll(".agregar_boton");

//boton comprar del carrito
const comprar_boton = document.getElementById("comprar_boton");



let carritoVisible = false;

//muestra header

const mostrarInfoHeader = () =>{
    let cantidadproductos = 0;
    axios
    .get("/consulta_carrito")
    .then((res) => res.data.carrito)
    .then((data) => {
        data.forEach((productoCarrito) => {
            cantidadproductos += productoCarrito.cantidad;
        });
        header_h3.textContent = "("+cantidadproductos+")";
    });
    
}

mostrarInfoHeader();

//peticion productos y muestra productos y header info

const consultarProductos = (cb)=>{
    axios
    .get("/consulta_productos")
    .then((res) => res.data.productos)
    .then((data) => {
        data.forEach((producto) => {
            const newDiv = document.createElement("DIV");
            newDiv.setAttribute("class", "card");
            
            newImg = document.createElement('IMG');
            newImg.setAttribute('src', 'images/cpua.png')
            newImg.setAttribute("class", "card_img");
            
            
            
            const newH3_nombre = document.createElement("H3");
            newH3_nombre.textContent = producto.nombre;
            newH3_nombre.setAttribute('class', 'card_title');

            const newH3_descripcion = document.createElement("H3");
            newH3_descripcion.textContent = producto.descripcion;
            newH3_descripcion.setAttribute('class', 'descripcion')
            
            
            const newDiv_precioyStock = document.createElement("DIV");
            newDiv_precioyStock.setAttribute("class", "preciostock");
            const newH3_precio = document.createElement("H3");
            newH3_precio.setAttribute('class', 'precio')
            newH3_precio.textContent = "$" + producto.precio;

            const newH3_stock = document.createElement("H3");
            newH3_stock.textContent = "Stock: " + producto.stock;
            newH3_stock.setAttribute ('class', 'stock_visor');
            newDiv_precioyStock.append(newH3_precio, newH3_stock)
            newDiv.append(newH3_nombre,newImg)
            
            // BArra inferior
            const newDiv_barraInferior = document.createElement("DIV");
            newDiv_barraInferior.setAttribute("class", "barraInferior");
            
            
            const newDiv_botones = document.createElement('DIV')
            newDiv_botones.setAttribute('class', 'card_botones');
           
		 const newBoton_agregar = document.createElement('BUTTON')
            newBoton_agregar.textContent = "Agregar al carrito"
            newBoton_agregar.setAttribute("class", `agregar_boton ${producto._id} ${producto.stock}`);
            const newBoton_comprar = document.createElement('BUTTON')
            newBoton_comprar.textContent = "Comprar"
            newBoton_comprar.setAttribute('class', 'comprar_boton')
            newBoton_comprar.setAttribute('id', 'comprar_boton')
            newDiv_botones.append(newBoton_agregar, newBoton_comprar)


            
            newDiv_barraInferior.append(newH3_descripcion, newDiv_precioyStock, newDiv_botones);
            
            // const newButton = document.createElement("BUTTON");
            // newButton.setAttribute("class", `agregar_btn ${producto._id}`);
            // newButton.setAttribute("title", "Agregar al carrito");
            // newButton.textContent = "+";
            
           
            // newDiv_barraInferior.append(newButton);
            newDiv.append(newDiv_barraInferior);
            
            fragment.append(newDiv);
        });
        cards.append(fragment);
        
        //Botones agregar
        cb(document.querySelectorAll(".agregar_boton"), document.getElementById("comprar_boton"));
    });
    
}


// Boton Agregar

for (const boton of agregar_boton) {
    const indice_boton = [...agregar_boton].indexOf(boton)
    boton.addEventListener('click', ()=>{
        
        //peticion
        axios.get(`/agregar_carrito/${boton.classList[1]}`)
        .then(res => res.data)
        .then(data => {
            if(data){
                //cambiar visualizaciond de stock
                 document.querySelectorAll('.stock_visor')[indice_boton].textContent = `Stock: ${data.stock}`;
                //actualiza la clase que contiene el stock enel botn
                boton.classList.remove(`${boton.classList[2]}`)
                boton.classList.add(`${data.stock}`)
                               
                //cambiar visualizacion de productos en el carrito en el header
                mostrarInfoHeader();
            }else{
                //MENSAJE DE ERROR 
            }
        }) 
    })
    
}
    
    
    
    
    carrito.addEventListener('click', (e)=>{
        if (!carritoVisible){
            axios.get('/consulta_carrito')
            .then(res => res.data.carrito)
        .then(data =>{
            cards.classList.add('invisible')
            containerCarrito.classList.remove('invisible')
             
            for (const product of data) {
                // productos del carrito
                newDiv_producto = document.createElement('DIV');
                newDiv_producto.setAttribute('class', 'carrito_producto');
                newImg = document.createElement('IMG');
                newImg.setAttribute('src', 'images/cpua.png')
                newImg.setAttribute('class', 'carrito_image')
                newH2_nombre = document.createElement('H2')
                newH2_nombre.textContent = product.nombre;
                newH2_cantidad = document.createElement('H2')
                newH2_cantidad.textContent = 'x'+product.cantidad;
                newH2_cantidad.setAttribute('class', 'carrito_cantidad');
                newH2_total = document.createElement('H2')
                newH2_total.setAttribute('class', 'carrito_total');
                newH2_total.textContent = '$'+product.total;
                newDiv_producto.append(newImg, newH2_nombre, newH2_cantidad, newH2_total)
                fragment.append(newDiv_producto)
                
            }

            newH2ruta = document.createElement('h2')
            newH2ruta.textContent = "> mi carrito"
            newH2ruta.setAttribute('class', 'micarrito_header')
            ruta.append(newH2ruta)
            productos_carrito.append(fragment);
            
            //resumen carrito
            newDiv_resumen = document.createElement('DIV');
            newDiv_resumen.setAttribute('class', 'resumenCarrito');
            
            newH2= document.createElement('H2')
            newH2.setAttribute('class', 'resumen_h2');
            newH2.textContent= "Resumen";
            
            newH3= document.createElement('H3')
            newH3.setAttribute('class', 'resumen_total');

            newButton= document.createElement('BUTTON')
            newButton.setAttribute('class', 'comprar_btn');
            newButton.setAttribute('id', 'comprar_btn_resumen');
            newButton.textContent="Comprar";


            let total = 0;
            data.forEach(producto =>{
                total += producto.total;
            })
            newH3.textContent= "Total: $" + total ;

            newDiv_resumen.append(newH2, newH3, newButton)    
            containerCarrito.append(newDiv_resumen)
            
            

            comprar_btn_resumen.addEventListener('click', ()=>{
                axios.get('/checkout')
                .then(res => location.href = res.data)

            })

            
        })
    carritoVisible=true;
    }
})

