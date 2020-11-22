# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  academic_year          :integer(4)
#  coop_cycle             :string
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  graduation_year        :integer(4)
#  image_url              :string
#  is_advisor             :boolean          default(FALSE), not null
#  major                  :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  username               :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_username              (username)
#
require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
