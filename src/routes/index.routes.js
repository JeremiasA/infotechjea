const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller.js');

// paginas
router.get('/', controller.index)
router.get('/servicios', controller.servicios)
router.get('/productos', controller.productos)
router.get('/contacto', controller.contacto)

//carrito
router.get('/consulta_carrito', controller.consulta_carrito);
router.get('/agregar_carrito/:id', controller.agregar_carrito);
router.get('/quitar/:id', controller.quitar);

//compra
router.get('/checkout', controller.checkout);
router.get('/checkoutindividual/:id', controller.checkoutIndividual);

//alta
router.get('/alta_productos', controller.alta_productos);
router.post('/altaproducto', controller.altaproducto);
module.exports = router;