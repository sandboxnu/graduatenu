# == Schema Information
#
# Table name: users
#
#  id                :bigint(8)        not null, primary key
#  academic_year     :integer(4)
#  catalog_year      :integer(4)
#  coop_cycle        :string
#  courses_completed :json             default([]), is an Array
#  courses_transfer  :json             default([]), is an Array
#  email             :string           default(""), not null
#  graduation_year   :integer(4)
#  image_url         :string
#  is_advisor        :boolean          default(FALSE), not null
#  major             :string
#  username          :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  nu_id             :string
#
# Indexes
#
#  index_users_on_email     (email) UNIQUE
#  index_users_on_username  (username)
#
require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
