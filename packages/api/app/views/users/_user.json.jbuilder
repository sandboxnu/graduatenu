json.(user, :id, :email, :full_name, :academic_year, :graduation_year, :major, :coop_cycle, :concentration, :is_advisor, :nu_id, :catalog_year, :courses_completed, :courses_transfer, :primary_plan_id)
json.token user.generate_jwt
