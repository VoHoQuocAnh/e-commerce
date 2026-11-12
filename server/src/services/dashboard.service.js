// server/src/services/dashboard.service.js
const { Op } = require('sequelize');
const { sequelize, Order, User, Product, OrderItem } = require('../models');
const { ORDER_STATUS } = require('../constants/orderStatus');
const ROLES = require('../constants/roles');

const getDashboardStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalCustomers,
    totalProducts,
    totalOrders,
    revenueRow,
    ordersByStatus,
    dailyRevenue,
    monthlyRevenue,
    topProducts,
  ] = await Promise.all([
    User.count({ where: { role: ROLES.USER } }),
    Product.count(),
    Order.count(),
    Order.findOne({
      where: { orderStatus: ORDER_STATUS.COMPLETED },
      attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('total_amount')), 0), 'total']],
      raw: true,
    }),
    Order.findAll({
      attributes: [
        'orderStatus',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['order_status'],
      raw: true,
    }),
    Order.findAll({
      where: {
        orderStatus: ORDER_STATUS.COMPLETED,
        created_at: { [Op.gte]: thirtyDaysAgo },
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true,
    }),
    Order.findAll({
      where: { orderStatus: ORDER_STATUS.COMPLETED },
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'ASC']],
      limit: 12,
      raw: true,
    }),
    OrderItem.findAll({
      attributes: [
        'productId',
        'productName',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'totalRevenue'],
      ],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [],
          where: { orderStatus: { [Op.ne]: ORDER_STATUS.CANCELLED } },
        },
      ],
      group: ['product_id', 'product_name'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 5,
      raw: true,
    }),
  ]);

  return {
    summary: {
      totalRevenue: Number(revenueRow?.total || 0),
      totalOrders,
      totalCustomers,
      totalProducts,
    },
    ordersByStatus,
    dailyRevenue: dailyRevenue.map((d) => ({
      date: d.date,
      revenue: Number(d.revenue),
      orders: Number(d.orders),
    })),
    monthlyRevenue: monthlyRevenue.map((m) => ({
      month: m.month,
      revenue: Number(m.revenue),
      orders: Number(m.orders),
    })),
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      totalSold: Number(p.totalSold),
      totalRevenue: Number(p.totalRevenue),
    })),
  };
};

module.exports = {
  getDashboardStats,
};
