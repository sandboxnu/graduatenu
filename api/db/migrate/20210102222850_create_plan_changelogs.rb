class CreatePlanChangelogs < ActiveRecord::Migration[6.0]
  def change
    create_table :plan_changelogs do |t|
      t.string :log, null: false
      t.belongs_to :plan
      t.belongs_to :user
      t.timestamps
    end
  end
end
