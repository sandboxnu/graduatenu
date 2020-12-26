json.templates do
  json.partial! 'templates/folder', folders: @folders
end

json.next_page @next_page
json.last_page @last_page