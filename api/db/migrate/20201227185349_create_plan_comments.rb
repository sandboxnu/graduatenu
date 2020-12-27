 class CreatePlanComments < ActiveRecord::Migration[6.0]
  def change
    create_table :plan_comments do |t|
      t.string :author, null: false
      t.string :comment, null: false
      t.belongs_to :plan
      t.timestamps
    end
  end
end
