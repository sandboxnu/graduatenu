json.array! @plans do |plan|
  json.partial! 'plans/plan', plan: plan
end