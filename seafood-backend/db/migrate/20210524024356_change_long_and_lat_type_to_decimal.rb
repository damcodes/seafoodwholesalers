class ChangeLongAndLatTypeToDecimal < ActiveRecord::Migration[6.1]
  def change
    change_column :companies, :longitude, :decimal, precision: 8
    change_column :companies, :latitude, :decimal, precision: 8
  end
end
