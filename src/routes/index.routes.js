const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller.js');

router.get('/', controller.index)
router.get('/servicios', controller.servicios)
router.get('/productos', controller.productos)
router.get('/contacto', controller.contacto)
router.get('/consulta_carrito', controller.consulta_carrito);
router.get('/agregar_carrito/:id', controller.agregar_carrito);
router.get('/checkout', controller.checkout);

module.exports = router;