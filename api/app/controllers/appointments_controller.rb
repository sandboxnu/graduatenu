class AppointmentsController < ApplicationController
    before_action :set_advisor

    def index
        @appointments = Appointment.where(user_id: @advisor.id, seen: FALSE)
        p @appointments
    end

    def show
        @appointment = Appointment.find_by(id: params[:id])
        render :show
    end

    def set_advisor
        @advisor = User.find_by_id(params[:user_id])
    end

    def appointment_params
        params.require(:appointment).permit(:student_id, :advisor_id, :plan_id, :appointment_time)
    end
end
