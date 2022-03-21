# == Schema Information
#
# Table name: folders
#
#  id         :bigint(8)        not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint(8)
#
class Folder < ApplicationRecord
  belongs_to :user
  has_many :template_plans

  alias advisor user
end
