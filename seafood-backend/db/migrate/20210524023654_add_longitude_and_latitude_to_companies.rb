class AddLongitudeAndLatitudeToCompanies < ActiveRecord::Migration[6.1]
  def change
    add_column :companies, :longitude, :integer
    add_column :companies, :latitude, :integer
  end
end
