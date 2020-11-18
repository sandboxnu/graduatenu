class RenamePlanStringToCoopCycle < ActiveRecord::Migration[6.0]
  def change
    rename_column :plans, :planString, :coop_cycle
  end
end
