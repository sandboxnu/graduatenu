# == Schema Information
#
# Table name: appointments
#
#  id               :bigint(8)        not null, primary key
#  appointment_time :datetime         not null
#  seen             :boolean          default(FALSE)
#  plan_id          :bigint(8)        not null
#  student_id       :bigint(8)        not null
#  user_id          :bigint(8)        not null
#
# Indexes
#
#  index_appointments_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Appointment < ActiveRecord::Base
    belongs_to :user
end
