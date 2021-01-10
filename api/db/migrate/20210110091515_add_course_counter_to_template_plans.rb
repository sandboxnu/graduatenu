class AddCourseCounterToTemplatePlans < ActiveRecord::Migration[6.0]
  def change
    add_column :template_plans, :course_counter, :integer
  end
end
