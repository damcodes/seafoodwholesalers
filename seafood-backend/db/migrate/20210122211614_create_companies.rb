class CreateCompanies < ActiveRecord::Migration[6.1]
  def change
    create_table :companies do |t|
      t.text :name
      t.text :address

      t.timestamps
    end
  end
end
