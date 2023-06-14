//  const Card = require('../../../MarketOfManyCards/backend/models/Card');
// const card = require('../../../MarketOfManyCards/backend/models/Card')

// exports.getCards = async (req, res) => {
//     const { cards } = req.query;
//     const limit = 10;

//     try {
//         const offset = (cards - 1) * limit;
//         const cartas = await Card.findAll({ 
//             limit: limit,
//             offset,
//         });

//         res.status(200).json(cartas);
//     }  catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }
// };

// exports.saveCards = async (res, res) => {
//     const { cards } = req.body;
    
//     try {
//         await Card.bulkCreate(cards);
//         res.status(200).json({ message: 'Cartas guardadas exitosamente.' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }
// };
// const axios = require('axios');
// const Card = require('../models/Card');

// const saveCardsFromAPI = async () => {
//   try {
//     const response = await axios.get('https://api.scryfall.com/cards/search', {
//       params: {
//         q: 'Nombre de la carta',
//         limit: 100,
//       },
//     });

//     const cards = response.data.data;
//     const cardsToSave = [];

//     cards.forEach((card) => {
//       const { name, set, mana_cost, cmc, type_line, oracle_text, flavor_text, collector_number, power, toughness, loyalty, multiverse_ids } = card;

//       const newCard = Card.build({
//         name,
//         set_id: set,
//         mana_cost,
//         cmc,
//         type: type_line,
//         text: oracle_text,
//         flavor_text,
//         number: collector_number,
//         power,
//         toughness,
//         loyalty,
//         multiverse_ID: multiverse_ids[0],
//       });

//       cardsToSave.push(newCard);
//     });

//     await Card.bulkCreate(cardsToSave);

//     console.log('Cartas guardadas exitosamente.');
//   } catch (error) {
//     console.error('Error al guardar las cartas:', error);
//   }
// };

// module.exports = {
//   saveCardsFromAPI,
// };
const Card = require('../models/Card');

// Obtener todas las tarjetas
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.json(cards);
  } catch (error) {
    console.error('Error al obtener las tarjetas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las tarjetas.' });
  }
};

// Crear una nueva tarjeta
const createCard = async (req, res) => {
  try {
    const { id, name, set_id, mana_cost, cmc, type, text, flavor_text, number, power, toughness, loyalty, multiverse_ID } = req.body;
    
    const newCard = await Card.create({
      id,
      name,
      set_id,
      mana_cost,
      cmc,
      type,
      text,
      flavor_text,
      number,
      power,
      toughness,
      loyalty,
      multiverse_ID,
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error al crear la tarjeta:', error);
    res.status(500).json({ error: 'Ocurrió un error al crear la tarjeta.' });
  }
};

// Obtener una tarjeta por su ID
const getCardById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const card = await Card.findByPk(id);
    
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }
  } catch (error) {
    console.error('Error al obtener la tarjeta:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener la tarjeta.' });
  }
};

// Actualizar una tarjeta por su ID
const updateCardById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const card = await Card.findByPk(id);
    
    if (card) {
      const { name, set_id, mana_cost, cmc, type, text, flavor_text, number, power, toughness, loyalty, multiverse_ID } = req.body;
      
      await card.update({
        name,
        set_id,
        mana_cost,
        cmc,
        type,
        text,
        flavor_text,
        number,
        power,
        toughness,
        loyalty,
        multiverse_ID,
      });

      res.json(card);
    } else {
      res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }
  } catch (error) {
    console.error('Error al actualizar la tarjeta:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar la tarjeta.' });
  }
};

// Eliminar una tarjeta por su ID
const deleteCardById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const card = await Card.findByPk(id);
    
    if (card) {
      await card.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Tarjeta no encontrada.' });
    }
  } catch (error) {
    console.error('Error al eliminar la tarjeta:', error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar la tarjeta.' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  getCardById,
  updateCardById,
  deleteCardById,
};
