class AddStatusToRoutes < ActiveRecord::Migration[6.1]
  def change
    add_column :routes, :status, :text, default: 'pre-ship'
  end
end
