class AddCatalogYearFieldToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :catalog_year, :integer
  end
end
