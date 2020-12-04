json.(user, :id, :email, :username, :academic_year, :graduation_year, :major, :coop_cycle, :is_advisor, :nu_id, :courses_completed, :courses_transfer)
json.token user.generate_jwt