# == Schema Information
#
# Table name: courses
#
#  id       :bigint(8)        not null, primary key
#  subject  :string
#  class_id :integer(4)
#
class Course < ApplicationRecord
  belongs_to :user
end
