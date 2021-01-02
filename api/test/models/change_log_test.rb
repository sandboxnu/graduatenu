# == Schema Information
#
# Table name: change_logs
#
#  id         :bigint(8)        not null, primary key
#  log        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  plan_id    :bigint(8)
#  user_id    :bigint(8)
#
# Indexes
#
#  index_change_logs_on_plan_id  (plan_id)
#  index_change_logs_on_user_id  (user_id)
#
require 'test_helper'

class ChangeLogTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
