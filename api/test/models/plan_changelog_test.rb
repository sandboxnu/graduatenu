# == Schema Information
#
# Table name: plan_changelogs
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
#  index_plan_changelogs_on_plan_id  (plan_id)
#  index_plan_changelogs_on_user_id  (user_id)
#
require 'test_helper'

class PlanChangelogTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
