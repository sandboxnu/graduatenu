# == Schema Information
#
# Table name: plans
#
#  id                      :bigint(8)        not null, primary key
#  approved_schedule       :json
#  catalog_year            :integer(4)       default(2018)
#  coop_cycle              :string
#  course_counter          :integer(4)
#  course_warnings         :json             default([]), is an Array
#  last_requested_approval :datetime
#  last_viewed             :datetime
#  last_viewer             :bigint(8)
#  link_sharing_enabled    :boolean
#  major                   :string
#  name                    :string
#  schedule                :json
#  warnings                :json             default([]), is an Array
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  user_id                 :bigint(8)        not null
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
  VIEWING_BUFFER = 30.seconds

  before_create :set_last_viewed, :set_last_viewer

  belongs_to :user

  has_many :plan_comments

  def last_viewed_by
    User.find_by_id(self.last_viewer)
  end

  def being_edited_by_student?
    being_edited? && self.user_id == self.last_viewer
  end

  def being_edited_by_advisor?
    being_edited? && self.user_id != self.last_viewer
  end

  private

  def being_edited?
    Time.zone.now - self.last_viewed <= VIEWING_BUFFER
  end

  # set last_viewed to created_at time if not provided
  def set_last_viewed
    self.last_viewed ||= self.created_at
  end

  def set_last_viewer
    self.last_viewer ||= self.user_id
  end
end
