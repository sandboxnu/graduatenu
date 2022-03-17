class AddLastRequestedApprovalToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :last_requested_approval, :timestamp
  end
end
