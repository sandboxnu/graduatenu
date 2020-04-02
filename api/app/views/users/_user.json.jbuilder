json.(user, :id, :email, :username, :academic_year, :graduation_year)
json.token user.generate_jwt