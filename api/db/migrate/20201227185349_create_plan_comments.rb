class CreatePlanComments < ActiveRecord::Migration[6.0]
  def change
    create_table :plan_comments do |t|
      t.bigint :plan_id
      t.bigint :user_id
      t.datetime :timestamp
      t.string :comment
    end
  end
end
