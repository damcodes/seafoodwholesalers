class AddAvailableWeightToProducts < ActiveRecord::Migration[6.1]
  def change
    add_column :products, :avail_weight, :integer, default: 0
  end
end
