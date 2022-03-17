class AddApprovedScheduleToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :approved_schedule, :json
  end
end
