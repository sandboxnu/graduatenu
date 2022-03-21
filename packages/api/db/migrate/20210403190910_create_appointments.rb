class CreateAppointments < ActiveRecord::Migration[6.0]
  def change
    create_table :appointments do |t|
      t.bigint :student_id, null: false
      t.bigint :plan_id, null: false
      t.datetime :appointment_time, null: false
      t.boolean :seen, default: false
      t.references :user, null: false, foreign_key: true
    end
  end
end
