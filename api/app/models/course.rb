# == Schema Information
#
# Table name: courses
#
#  id         :bigint(8)        not null, primary key
#  subject    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  class_id   :integer(4)       not null
#  user_id    :bigint(8)
#
# Indexes
#
#  index_courses_on_user_id  (user_id)
#
class Course < ApplicationRecord
  belongs_to :user
end
