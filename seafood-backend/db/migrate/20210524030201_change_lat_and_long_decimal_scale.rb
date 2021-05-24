class ChangeLatAndLongDecimalScale < ActiveRecord::Migration[6.1]
  def change
    change_column :companies, :longitude, :decimal, precision: 10, scale: 8
    change_column :companies, :latitude, :decimal, precision: 10, scale: 8
  end
end
