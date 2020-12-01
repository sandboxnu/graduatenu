class AddTransferAndCompletedToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :courses_completed, :json, rray: true, default: []
    add_column :users, :courses_transfer, :json, array: true, default: []
  end
end
