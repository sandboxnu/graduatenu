class NotificationMailer < ApplicationMailer
    default :from => 'itsmearun98@gmail.com' # lol gotta get our own email account

  def request_approval_email(advisor, student, plan)
    @advisor = advisor
    @student = student
    @plan = plan
    to_email = "jeevanantham.a@northeastern.edu" # gotta change this too
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
    to_email = "jeevanantham.a@northeastern.edu" # gotta change this too
    if Rails.env.production? 
      to_email = @student.email
    end
    mail( :to => to_email,
    :subject => @advisor.full_name + ' approved your ' + plan.name)
  end
end
