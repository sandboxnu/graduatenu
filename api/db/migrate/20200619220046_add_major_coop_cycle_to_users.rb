class AddMajorCoopCycleToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :major, :string
    add_column :users, :coop_cycle, :string
  end
end
