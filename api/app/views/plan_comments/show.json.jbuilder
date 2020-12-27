json.plan_comment do |json|
  json.partial! 'plan_comments/plan_comment', plan_comment: @plan_comment
end