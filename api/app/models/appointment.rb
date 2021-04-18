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

    def major
        User.find_by_id(self.student_id).major
    end

    def fullname
        User.find_by_id(self.student_id).full_name
    end

    def email
        User.find_by_id(self.student_id).email
    end

    def nuid
        User.find_by_id(self.student_id).nu_id
    end

    def plan_name
        Plan.find_by_id(self.plan_id).name
    end

    def plan_major
        Plan.find_by_id(self.plan_id).major
    end
end
