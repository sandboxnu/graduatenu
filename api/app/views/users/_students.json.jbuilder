json.array! students do |student|
  json.partial! 'users/studentAbr', user: student
end
