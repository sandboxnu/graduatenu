# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  academic_year          :integer(4)
#  catalog_year           :integer(4)
#  concentration          :string
#  coop_cycle             :string
#  courses_completed      :json             default([]), is an Array
#  courses_transfer       :json             default([]), is an Array
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  full_name              :string
#  graduation_year        :integer(4)
#  image_url              :string
#  is_advisor             :boolean          default(FALSE), not null
#  major                  :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  nu_id                  :string
#  primary_plan_id        :bigint(8)
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_full_name             (full_name)
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
class User < ApplicationRecord
  JWT_EXPIRATION = 60.days
  has_many :plans, dependent: :destroy
  has_many :folders, dependent: :destroy # only relevant for advisors

  #validates a non-unique full_name and allows spaces
  validates :full_name, presence: true, allow_blank: false, format: { with: /\A[a-zA-Z0-9 ]+\z/ }

  def generate_jwt
    JWT.encode({ id: id, exp: JWT_EXPIRATION.from_now.to_i }, Rails.application.credentials.secret_key_base)
  end
end
