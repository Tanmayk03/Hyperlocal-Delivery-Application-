import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'

const MyOrders = () => {
  const orders = useSelector((state) => state.orders?.order || [])

  console.log("Order Items", orders)

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <NoData />
      ) : (
        orders.map((order, index) => (
          <div
            key={`${order._id}-${index}`}
            className="order rounded p-4 text-sm border-b"
          >
            <p className="mb-2 font-semibold">Order No: {order?.orderId}</p>
            <div className="flex items-center gap-3">
              <img
                src={
                  Array.isArray(order.product_details?.image)
                    ? order.product_details.image[0]
                    : order.product_details?.image
                }
                alt={order.product_details?.name}
                className="w-14 h-14 object-cover rounded"
              />
              <p className="font-medium">{order.product_details?.name}</p>
            </div>
            <div className="mt-2 text-gray-600">
              <p>Status: {order.payment_status}</p>
              <p>Total: ₹{order.totalAmt}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrders
