class ChangeTemplatesCoopCycleToNull < ActiveRecord::Migration[6.0]
  def change
    change_column :template_plans, :coop_cycle, :string, :null => true
  end
end
