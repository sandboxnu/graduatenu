class AddFieldsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :username, :string
    add_index :users, :username, unique: true
    add_column :users, :academic_year, :integer
    add_column :users, :graduation_year, :integer
  end
end
