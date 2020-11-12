class AddAdvisorInfoToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :image_url, :string
    add_column :users, :is_advisor, :boolean, default: false, null: false
  end
end
