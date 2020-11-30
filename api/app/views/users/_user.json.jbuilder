json.(user, :id, :email, :username, :academic_year, :graduation_year, :major, :coop_cycle, :is_advisor, :nu_id)
json.token user.generate_jwt