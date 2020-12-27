class NotificationMailer < ApplicationMailer
    default :from => 'graduatenu@outlook.com'

  def request_approval_email(advisor, student, plan)
    @advisor = advisor
    @student = student
    @plan = plan
    to_email = "graduatenu@outlook.com"
    p ENV["SENDGRID_API_KEY"]
    if Rails.env.production? 
      to_email = @advisor.email
    end
    mail( :to => to_email,
    :subject => @student.full_name + ' requested an approval from you' )
  end

  def approved_email(advisor, student, plan)
    @advisor = advisor
    @student = student
    @plan = plan
    to_email = "graduatenu@outlook.com"
    if Rails.env.production? 
      to_email = @student.email
    end
    mail( :to => to_email,
    :subject => @advisor.full_name + ' approved your ' + plan.name)
  end
end
