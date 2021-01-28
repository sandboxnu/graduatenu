class EncryptNuidAndEmail < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :email_ciphertext, :text
    add_column :users, :nu_id_ciphertext, :text

    add_column :users, :email_bidx, :string
    add_index :users, :email_bidx, unique: true

    add_column :users, :nu_id_bidx, :string
    add_index :users, :nu_id_bidx, unique: true

    remove_column :users, :email, :string
    remove_column :users, :nu_id, :string
  end
end
