json.user do |json|
  json.partial! 'plans/plan', plan: @plan
end