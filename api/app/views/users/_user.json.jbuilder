json.(user, :id, :email, :username, :academic_year, :graduation_year, :major, :coop_cycle, :catalog_year, :nu_id)
json.token user.generate_jwt