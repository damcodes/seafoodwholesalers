class CreateRoutes < ActiveRecord::Migration[6.1]
  def change
    create_table :routes do |t|
      t.text :name

      t.timestamps
    end
  end
end
