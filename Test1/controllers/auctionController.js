const Auction = require('../models/Auction');
const User = require('../models/User');


exports.createAuction = async (req, res) => {
  const { id } = req.params;
  const auctionData = req.body;

  // Validación de datos
  if (!auctionData.title || !auctionData.description || !auctionData.startingPrice || !auctionData.duration) {
    return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const auction = await Auction.create({
      ...auctionData,
      created_at: new Date(),
      seller_id: id,
    });

    return res.json(auction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al crear la subasta' });
  }
};
