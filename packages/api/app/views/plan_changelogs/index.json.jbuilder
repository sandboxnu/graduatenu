json.array! @plan_changelogs do |plan_changelog|
  json.partial! 'plan_changelogs/plan_changelog', plan_changelog: plan_changelog
end
