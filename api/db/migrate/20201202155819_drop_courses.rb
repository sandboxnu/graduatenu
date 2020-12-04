class DropCourses < ActiveRecord::Migration[6.0]
  def change
    drop_table :courses
  end
end
