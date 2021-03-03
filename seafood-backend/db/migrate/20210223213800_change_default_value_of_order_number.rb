class ChangeDefaultValueOfOrderNumber < ActiveRecord::Migration[6.1]
  def change
    remove_column :orders, :order_number
    add_column :orders, :order_number, :integer
  end
end
