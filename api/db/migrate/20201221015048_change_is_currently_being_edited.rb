class ChangeIsCurrentlyBeingEdited < ActiveRecord::Migration[6.0]
  def change
    remove_column :plans, :is_currently_being_edited

    add_column :plans, :last_viewer, :bigint
  end
end
