class AddLastViewedToPlans < ActiveRecord::Migration[6.0]
  def up
    add_column :plans, :last_viewed, :timestamp
    Plan.update_all("last_viewed=updated_at")
  end

  def def down
    remove_column :plans, :last_viewed
  end
end
