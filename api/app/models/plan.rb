# == Schema Information
#
# Table name: plans
#
#  id                        :bigint(8)        not null, primary key
#  coop_cycle                :string
#  course_counter            :integer(4)
#  course_warnings           :json             default([]), is an Array
#  is_currently_being_edited :boolean          default(FALSE), not null
#  last_viewed               :datetime
#  link_sharing_enabled      :boolean
#  major                     :string
#  name                      :string
#  schedule                  :json
#  warnings                  :json             default([]), is an Array
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  user_id                   :bigint(8)        not null
#
# Indexes
#
#  index_plans_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Plan < ApplicationRecord
  before_create :set_last_viewed

  belongs_to :user

  private

  # set last_viewed to created_at time if not provided
  def set_last_viewed
    self.last_viewed ||= self.created_at
  end
end
