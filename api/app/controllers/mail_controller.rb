class MailController < ApplicationController  

  def send_request_approval_email
    advisor = User.find_by(email: params[:advisor_email])
    student = User.find_by(email: params[:student_email])
    plan = Plan.find_by(id: params[:plan_id], user_id: student.id)
    NotificationMailer.request_approval_email(advisor, student, plan).deliver
    render status: 200, json: @controller.to_json
  end

  def send_plan_approved_email
    advisor = User.find_by(email: params[:advisor_email])
    student = User.find_by(email: params[:student_email])
    plan = Plan.find_by(id: params[:plan_id], user_id: student.id)
    NotificationMailer.approved_email(advisor, student, plan).deliver
    render status: 200, json: @controller.to_json
  end
end

private 

def params
  params.require(:mail, :student_email, :advisor_email, :plan_id)
end
