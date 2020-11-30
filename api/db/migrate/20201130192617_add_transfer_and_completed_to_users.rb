class AddTransferAndCompletedToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column: :users, :completed_courses, :json
    add_column: :users, :transfer_courses, :json
  end
end
