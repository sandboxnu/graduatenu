json.(user, :id, :email, :username, :academic_year, :graduation_year, :major, :coop_cycle)
json.token user.generate_jwt