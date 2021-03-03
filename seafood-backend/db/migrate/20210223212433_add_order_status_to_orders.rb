class AddOrderStatusToOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :orders, :order_status, :text, default: 'pending'
  end
end
