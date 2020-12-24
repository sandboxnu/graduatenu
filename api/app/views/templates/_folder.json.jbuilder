json.id folder.id
json.name folder.name
json.template_plans folder.template_plans do |template_plan|
  json.partial! 'templates/template', template_plan: template_plan
end
