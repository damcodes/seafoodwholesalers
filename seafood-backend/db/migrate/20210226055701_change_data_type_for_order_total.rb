class ChangeDataTypeForOrderTotal < ActiveRecord::Migration[6.1]
  def change
    remove_column :orders, :order_total
    add_column :orders, :order_total, :float, default: 0.0
  end
end
