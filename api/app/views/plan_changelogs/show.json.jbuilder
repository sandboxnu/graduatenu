json.plan_changelog do |json|
  json.partial! 'plan_changelogs/plan_changelog', plan_changelog: @plan_changelog
end
