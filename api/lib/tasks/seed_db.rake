desc 'Seed database with 100 users'
task :seed_users => :environment do
  100.times do |i|
    User.create!(
      email: "test#{i}@test.com",
      username: "Alex Grob #{i}",
      academic_year: 3,
      graduation_year: 2022,
      nu_id: "001234567#{i}",
      is_advisor: false,
      major: "Computer Science, BSCS",
    )
  end
end