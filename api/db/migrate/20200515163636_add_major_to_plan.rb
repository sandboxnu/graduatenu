class AddMajorToPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :major, :string
    add_column :plans, :planString, :string
  end
end
