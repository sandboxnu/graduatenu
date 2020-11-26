# == Schema Information
#
# Table name: template_plans
#
#  id           :bigint(8)        not null, primary key
#  catalog_year :integer(4)       not null
#  major        :string           not null
#  name         :string           not null
#  coop_cycle   :string           not null
#  schedule     :json
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint(8)
#
# Indexes
#
#  index_template_plans_on_user_id  (user_id)
#
class TemplatePlan < ApplicationRecord
  belongs_to :user, optional: true

  alias advisor user
end
