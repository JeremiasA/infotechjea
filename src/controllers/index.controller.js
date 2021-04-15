const Productos = require ('../models/model.productos');
const Producto_carrito = require ('../models/model.carrito');
const mercadopago = require('mercadopago');
// Agrega credenciales MP
mercadopago.configure({
    access_token: 'APP_USR-1338115471438019-041322-d04adbdf6dc1b079f220c2b4620612ab-743176881'
  });
const controller = {};

controller.index = (req, res)=>{
    res.render('index');
}

controller.servicios = (req, res)=>{
    res.render('servicios');
}

controller.productos = async (req, res)=>{
    const productos = await Productos.find();
    const carrito = await Producto_carrito.find({session : req.sessionID});
    res.render('productos', {productos, carrito});
}

controller.consulta_carrito = async (req, res) =>{
    const carrito = await Producto_carrito.find({session : req.sessionID})
    res.send({carrito});
}

controller.agregar_carrito = async (req, res) =>{
    try {
        const producto = await Productos.findById({_id : req.params.id});
        const busqueda = await Producto_carrito.findOne({nombre : producto.nombre, session : req.sessionID})

        if(producto.stock>=1){

        if(!busqueda){
            const cant = 1;
            const carrito = new Producto_carrito({
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cant,
                total: producto.precio,
                imgsrc: producto.imgsrc,
                session : req.sessionID
            })
            await carrito.save();
        }else{
            await busqueda.updateOne({cantidad : busqueda.cantidad++});
            await busqueda.updateOne({total : busqueda.precio*busqueda.cantidad});
            await busqueda.save();
        }
        //await producto.updateOne({stock: --producto.stock}); STOCK BAJA SOLO SI SE CONCRETA LA VENTA
        res.send(producto);
        
        
    }
    
   


    } catch (error) {
        console.log(error);
        res.send(error);
    }
        
    }

controller.quitar = async (req, res) =>{
    const {id} = req.params;
    const productoCarrito = await Producto_carrito.findById({_id : id});
    const busqueda = await Productos.findOne({nombre : productoCarrito.nombre})

    
    if((await Producto_carrito.findById({_id : id})).cantidad > 1){
        await productoCarrito.updateOne({cantidad: --productoCarrito.cantidad})
    }else if(productoCarrito.cantidad ==1){
        await Producto_carrito.deleteOne({_id:id})
    }
    
    res.end();
}


controller.contacto = (req, res)=>{
    res.render('contacto');
}



controller.checkoutIndividual = async (req,res)=>{
    const prod = await Productos.find({_id : req.params.id});

    const items = [];
    prod.forEach(producto =>{
        const item={
            title: producto.nombre,
            unit_price: producto.precio,
            quantity: 1
        }
        items.push(item)
    })

    // Crea un objeto de preferencia
    let preference = {items, "back_urls": {
        "success": "localhost:3000/productos",
        "failure": "http://www.tu-sitio/failure",
        "pending": "http://www.tu-sitio/pending"
    },
    "auto_return": "approved",};
                
// let preference = await Producto_carrito.find({session : req.sessionID});
    mercadopago.preferences.create(preference)
  .then(function(response){

    res.send(response.body.init_point);
    
  }).catch(function(error){
    console.log(error);
  });
}


controller.checkout = async (req,res)=>{
    const productosCarrito = await Producto_carrito.find({session : req.sessionID});
    const items = [];
    productosCarrito.forEach(producto =>{
        const item={
            title: producto.nombre,
            unit_price: producto.precio,
            quantity: producto.cantidad,
        }
        items.push(item)
    })
    
    
    // Crea un objeto de preferencia
    let preference = {items, "back_urls": {
        "success": "localhost:3000/productos",
        "failure": "http://www.tu-sitio/failure",
        "pending": "http://www.tu-sitio/pending"
    },
    "auto_return": "approved",};
                
// let preference = await Producto_carrito.find({session : req.sessionID});
console.log(preference)
    mercadopago.preferences.create(preference)
  .then(function(response){

    res.send(response.body.init_point);

  }).catch(function(error){
    console.log(error);
  });
}

controller.alta_productos = (req, res) =>{
    res.render('alta_productos')
}

controller.altaproducto = (req, res) =>{
    const producto = new Productos(req.body)
    producto.save();
    res.redirect("/productos")
}

module.exports= controller;
