class CreateAppointments < ActiveRecord::Migration[6.0]
  def change
    create_table :appointments do |t|
      t.bigint :student_id, null: false
      t.bigint :plan_id, null: false
      t.bigint :advisor_id, null: false
      t.datetime :appointment_time, null: false
      t.string :seen, default: false
    end
  end
end
