class AddCourseCounterToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :course_counter, :integer
  end
end
