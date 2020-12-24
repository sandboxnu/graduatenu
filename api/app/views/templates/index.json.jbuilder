json.array! @folders do |folder|
  json.partial! 'templates/folder', folder: folder
end