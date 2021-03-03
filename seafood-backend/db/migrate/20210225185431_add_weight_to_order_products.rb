class AddWeightToOrderProducts < ActiveRecord::Migration[6.1]
  def change
    add_column :order_products, :weight, :integer, default: 0
  end
end
