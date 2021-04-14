const Productos = require ('../models/model.productos')
const Producto_carrito = require ('../models/model.carrito')
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
                session : req.sessionID
            })
            await carrito.save();
        }else{
            await busqueda.updateOne({cantidad : busqueda.cantidad++});
            await busqueda.updateOne({total : busqueda.precio*busqueda.cantidad});
            await busqueda.save();
        }
        await producto.updateOne({stock: --producto.stock});
        res.send(producto);
        
        
    }
    
   


    } catch (error) {
        console.log(error);
        res.send(error);
    }
        
    }


controller.contacto = (req, res)=>{
    res.render('contacto');
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
    let preference = {items};
                
// let preference = await Producto_carrito.find({session : req.sessionID});
console.log(preference)
    mercadopago.preferences.create(preference)
  .then(function(response){

    res.send(response.body.init_point);

  }).catch(function(error){
    console.log(error);
  });
}

module.exports= controller;
