json.array! @plan_comments do |plan_comment|
  json.partial! 'plan_comments/plan_comment', plan_comment: plan_comment
end
