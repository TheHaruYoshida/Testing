const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Sale = require('../models/Sale');
const auctionController = require('../controllers/auctionController');

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Ruta para obtener un usuario por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Ruta para crear un usuario
router.post('/', async (req, res) => {
  const { nickname, email, contact } = req.body;

  // Validación de datos
  if (!nickname || !email || !contact) {
    return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios' });
  }

  // Verificar formato de correo electrónico válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Por favor, ingresa un correo electrónico válido' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
    }

    const newUser = await User.create({ nickname, email, contact, created_at: new Date() });
    return res.json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al crear el usuario' });
  }
});

// Ruta para actualizar un usuario por su ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nickname, email, contact } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.nickname = nickname;
      user.email = email;
      user.contact = contact;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Ruta para eliminar un usuario por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Ruta para crear una venta para un usuario
router.post('/:id/sales', async (req, res) => {
  const { id } = req.params;
  const { price, description, quantity } = req.body;

  // Validación de datos
  if (!price || !description || !quantity) {
    return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const sale = await Sale.create({
      price,
      description,
      quantity,
      created_at: new Date(),
      status: 'pending',
      seller_id: id,
    });

    return res.json(sale);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al crear la venta' });
  }
});

// Ruta para obtener las ventas de un usuario
router.get('/:id/sales', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { include: Sale });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const sales = user.Sales;
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ventas del usuario' });
  }
});

// Modo subasta
// Ruta para crear una subasta para un usuario
router.post('/:id/auctions', async (req, res) => {
  const { id } = req.params;
  const { price, description, quantity } = req.body;

  // Validación de datos
  if (!price || !description || !quantity) {
    return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const auction = await auctionController.createAuction(req, res);
    return res.json(auction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al crear la subasta' });
  }
});

module.exports = router;