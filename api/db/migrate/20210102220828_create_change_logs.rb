class CreateChangeLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :change_logs do |t|
      t.belongs_to :plan
      t.belongs_to :user
      t.string :log, null: false
      t.timestamps
    end
  end
end
