class AddCatalogYearToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :catalog_year, :integer, default: 2018
  end
end
