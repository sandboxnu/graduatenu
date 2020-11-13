class CreateCourses < ActiveRecord::Migration[6.0]
  def change
    create_table :courses do |t|
      t.integer :class_id, null: false
      t.string :subject, null: false
      t.belongs_to :user
      t.timestamps
    end
  end
end
