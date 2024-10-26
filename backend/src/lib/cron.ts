import Order from '@model/order.model';
import cron from 'node-cron';

// automatic exec in 24 hour
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const expiredOrders = await Order.updateMany(
      { expiresAt: { $lt: now }, status: 'Pending' },
      { status: 'Cancelled' },
    );
    console.log(`${expiredOrders.modifiedCount} orders have been cancelled.`);
  } catch (error) {
    console.error('Error cancelling expired orders:', error);
  }
});
