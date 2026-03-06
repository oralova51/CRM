const {Order} = require('../../db/models');


class OrderService {
  static async createOrder(orderData) {
    try {
      const order = await Order.create(orderData);
      return order;
    } catch (error) {
      throw new Error('Error creating order: ' + error.message);
    }
  } 

  static async getOrderById(orderId) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error('Error fetching order: ' + error.message);
    }
  }

  static async getOrdersByUserId(userId) {
    try {
      const orders = await Order.findAll({ where: { user_id: userId } });
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders: ' + error.message);
    }
  }
  
  static async updateOrder(orderId, updateData) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      await order.update(updateData);
      return order;
    } catch (error) {
      throw new Error('Error updating order: ' + error.message);
    }
  }
  
  static async deleteOrder(orderId) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      await order.destroy();
    } catch (error) {
      throw new Error('Error deleting order: ' + error.message);
    }
  }
  
}

module.exports = OrderService;