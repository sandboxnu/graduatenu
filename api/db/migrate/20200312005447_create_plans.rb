class CreatePlans < ActiveRecord::Migration[6.0]
  def change
    create_table :plans do |t|
      t.string :name
      t.boolean :link_sharing_enabled
      t.json :schedule
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
