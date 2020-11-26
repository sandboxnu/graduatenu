class AddNuIdToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :nu_id, :string
  end
end
