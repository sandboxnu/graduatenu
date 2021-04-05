class AppointmentsController < ApplicationController
    before_action :set_advisor, :set_user

    def index
        unless authorized
            render json: { error: "Requester is not an advisor" }, status: :bad_request
            return
        end

        @appointments = Appointment.where(user_id: @advisor.id, seen: FALSE)
    end

    def show
        unless authorized
            render json: { error: "Requester is not an advisor" }, status: :bad_request
            return
        end

        @appointment = Appointment.find_by(id: params[:id])
        render :show
    end

    def set_advisor
        @advisor = User.find_by_id(params[:user_id])
    end

    def appointment_params
        params.require(:appointment).permit(:student_id, :advisor_id, :plan_id, :appointment_time)
    end

    #sets the current user
    def set_user
        if signed_in?
        @user = User.find_by_id(@current_user_id)
        if @user == nil
            render json: {error: "User not found."}, status: 404
        end
        else
        render json: {error: "Unauthorized."}, status: :unprocessable_entity
        end
    end

    def authorized
        @user.is_advisor
      end
end
