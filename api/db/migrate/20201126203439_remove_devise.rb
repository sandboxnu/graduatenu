class RemoveDevise < ActiveRecord::Migration[6.0]
  def change
    remove_index :users, name: :index_users_on_username
    remove_index :users, name: :index_users_on_reset_password_token
    remove_column :users, :encrypted_password
    remove_column :users, :reset_password_token
    remove_column :users, :reset_password_sent_at
    remove_column :users, :remember_created_at
  end
end
