class AddWarningsToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :course_warnings, :json, array: true, default: []
    add_column :plans, :warnings, :json, array: true, default: []
  end
end
