class AddConcentrationToUsersPlansAndTemplatePlans < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :concentration, :string
    add_column :plans, :concentration, :string
    add_column :template_plans, :concentration, :string
  end
end
