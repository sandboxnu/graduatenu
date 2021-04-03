class AppointmentController < ApplicationController
    before_action :set_advisor, :set_student, :set_plan

    def index
        render json: {error: "Not implemented"}, status: :unprocessable_entity
    end

    def show
        render json: {error: "Not implemented"}, status: :unprocessable_entity
    end

    def create
        if @appointment = Appointment.create(appointment_params.merge({user_id: params[:user_id]}))
            render :show
        else
            render json: {error: "Unable to create appointment."}, status: :unprocessable_entity
        end
    end

    def set_plan
        @plan = Plan.find_by_id(params[:plan_id])

    def set_advisor
        @advisor = User.find_by_id(id: params[:user_id])
    end

    def set_student
        @student = User.find_by_id(params[:student_id])
    end

    def appointment_params
        params.require(:appointment).permit(:student_id, :advisor_id, :plan_id, :appointment_time)
    end
end
