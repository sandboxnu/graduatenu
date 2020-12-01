json.array! students do |student|
  json.partial! 'users/student', user: student
end
