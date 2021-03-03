class AddStopNumberToOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :orders, :stop, :integer, default: 0
  end
end
