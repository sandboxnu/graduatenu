class CreatePlanComments < ActiveRecord::Migration[6.0]
  def change
    create_table :plan_comments do |t|
      t.bigint :plan_id, null: false
      t.bigint :user_id, null: false
      t.datetime :timestamp, precision: 6, null: false
      t.string :comment, null: false
    end
    add_foreign_key :plan_comments, :users
    add_foreign_key :plan_comments, :plans
  end
end
