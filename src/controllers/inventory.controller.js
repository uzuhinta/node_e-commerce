const { OkResponse } = require('#src/core/success.response.js');
const InventoryService = require('#src/services/inventory.service.js');

class InventoryController {
  addStock = async (req, res) => {
    new OkResponse({
      message: 'List cart successfully',
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
