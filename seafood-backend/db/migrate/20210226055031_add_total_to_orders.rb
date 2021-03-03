class AddTotalToOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :orders, :order_total, :integer, default: 0 
  end
end
