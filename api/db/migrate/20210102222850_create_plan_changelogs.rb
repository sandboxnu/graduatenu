class CreatePlanChangelogs < ActiveRecord::Migration[6.0]
  def change
    create_table :plan_changelogs do |t|
      t.string :log, null: false
      t.bigint :author_id, null: false
      t.belongs_to :plan
      t.timestamps
    end
  end
end
