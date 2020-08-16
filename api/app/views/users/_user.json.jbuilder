json.(user, :id, :email, :username, :academic_year, :graduation_year, :major, :coop_cycle, :catalog_year)
json.token user.generate_jwt