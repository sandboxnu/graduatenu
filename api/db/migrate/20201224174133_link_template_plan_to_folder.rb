class LinkTemplatePlanToFolder < ActiveRecord::Migration[6.0]
  def change
    remove_index :template_plans, name: :index_template_plans_on_user_id
    remove_column :template_plans, :user_id, :bigint

    add_column :template_plans, :folder_id, :bigint
    add_index :template_plans, :folder_id
  end
end
