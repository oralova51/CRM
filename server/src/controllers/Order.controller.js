const OrderService = require("../services/Order.service");
const UserService = require("../services/User.service");
const { User } = require("../../db/models");

const formatResponse = require("../utils/formatResponse");

class OrderController {
  static async createOrder(req, res) {
    try {
      const { user_id, final_price } = req.body;

      if (!user_id) {
        return res
          .status(400)
          .json(formatResponse(400, "User ID is required to create an order"));
      }

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json(formatResponse(404, "User not found"));
      }

      // обновляем totalSpent
      await UserService.totalSpentChanger(user_id, final_price);

      const order = await OrderService.createOrder(req.body);

      res.json(formatResponse(201, "Order created successfully", { order }));
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json(formatResponse(500, "Failed to create order"));
    }
  }

  static async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json(formatResponse(404, "Order not found"));
      }
      res.json(formatResponse(200, "Order retrieved successfully", { order }));
    } catch (error) {
      console.error("Error retrieving order:", error);
      res.status(500).json(formatResponse(500, "Failed to retrieve order"));
    }
  }
  static async updateOrder(req, res) {
    try {
      const order = await OrderService.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json(formatResponse(404, "Order not found"));
      }
      res.json(formatResponse(200, "Order updated successfully", { order }));
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json(formatResponse(500, "Failed to update order"));
    }
  }

  static async deleteOrder(req, res) {
    try {
      await OrderService.deleteOrder(req.params.id);
      res.json(formatResponse(200, "Order deleted successfully"));
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json(formatResponse(500, "Failed to delete order"));
    }
  }
}

module.exports = OrderController;
