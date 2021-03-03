class AddRouteIdToOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :orders, :route_id, :integer
  end
end
