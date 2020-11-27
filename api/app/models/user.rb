# == Schema Information
#
# Table name: users
#
#  id              :bigint(8)        not null, primary key
#  academic_year   :integer(4)
#  coop_cycle      :string
#  email           :string           default(""), not null
#  graduation_year :integer(4)
#  image_url       :string
#  is_advisor      :boolean          default(FALSE), not null
#  major           :string
#  username        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  nu_id           :string
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
class User < ApplicationRecord
  has_many :transfer_courses, foreign_key: 'user_id', class_name: "Course"
  has_many :completed_courses, foreign_key: 'user_id', class_name: "Course"
  has_many :plans, dependent: :destroy
  
  #validates a non-unique username and allows spaces
  validates :username, presence: true, allow_blank: false, format: { with: /\A[a-zA-Z0-9 ]+\z/ }
  
  def generate_jwt
    JWT.encode({ id: id, exp: 60.days.from_now.to_i }, Rails.application.credentials.secret_key_base)
  end
end
