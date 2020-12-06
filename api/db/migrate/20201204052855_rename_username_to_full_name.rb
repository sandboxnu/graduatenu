class RenameUsernameToFullName < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :username, :full_name
  end
end
