class AddDefaultValuesToProducts < ActiveRecord::Migration[6.1]
  def change
    change_column :products, :description, :text, default: 'New Item'
    change_column :products, :price, :float, default: 0.0
    change_column :products, :item_number, :text, default: 'New Item'
  end
end
