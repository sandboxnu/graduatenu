class PlanChangelog < ApplicationRecord
    belongs_to :plan
    belongs_to :user

    def author
        user.full_name
    end
end
