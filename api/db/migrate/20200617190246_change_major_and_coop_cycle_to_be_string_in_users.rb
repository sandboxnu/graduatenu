class ChangeMajorAndCoopCycleToBeStringInUsers < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :major, :string
    change_column :users, :coop_cycle, :string
  end
end
