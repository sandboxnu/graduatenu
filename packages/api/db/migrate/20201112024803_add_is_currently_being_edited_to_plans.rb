class AddIsCurrentlyBeingEditedToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :is_currently_being_edited, :boolean, default: false, null: false
  end
end
