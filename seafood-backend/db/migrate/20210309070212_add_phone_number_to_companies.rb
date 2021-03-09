class AddPhoneNumberToCompanies < ActiveRecord::Migration[6.1]
  def change
    add_column :companies, :phone_number, :text
  end
end
