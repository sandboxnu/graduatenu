class AddMajorAndCoopCycleToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :major, :json
    add_column :users, :coop_cycle, :json
    end
  end
end
