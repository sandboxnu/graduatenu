class EncryptNuidAndEmail < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :email_ciphertext, :text
    add_column :users, :nu_id_ciphertext, :text
  end
end
