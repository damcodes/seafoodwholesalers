class AddCompanyIdToUsers < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :company
    add_reference :users, :company, foreign_key: true
  end
end
