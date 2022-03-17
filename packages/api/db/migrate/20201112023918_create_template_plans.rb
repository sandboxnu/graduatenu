class CreateTemplatePlans < ActiveRecord::Migration[6.0]
  def change
    create_table :template_plans do |t|
      t.string :name, null: false
      t.integer :catalog_year, null: false
      t.json :schedule
      t.string :major, null: false
      t.string :coop_cycle, null: false
      t.belongs_to :user
      t.timestamps
    end
  end
end
