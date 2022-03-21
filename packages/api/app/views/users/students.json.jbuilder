json.students do
  json.partial! "users/students", students: @students
end
json.next_page @next_page
json.last_page @last_page