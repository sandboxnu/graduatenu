class AddPrimaryPlanIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :primary_plan_id, :bigint
  end
end
