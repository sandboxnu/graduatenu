class UsersController < ApplicationController
    before_action :authenticate_user!

    #simply render user information for authenicated user, no additional processing required.
    def show
        if @current_user_id == Integer(params[:id])
            render :show
        else
            render json: { error: "Unauthorized" }, status: :unprocessable_entity
        end
    end

    def update
        if @current_user_id == Integer(params[:id])
            if current_user.update_attributes(user_params)
                render :show
            else
                render json: { errors: current_user.errors }, status: :unprocessable_entity
            end
        else
            render json: { error: "Unauthorized" }, status: :unprocessable_entity
        end
    end

    def all_students
        # make sure requester is an advisor
        requester = User.find_by_id(@current_user_id)

        unless requester.is_advisor
            render json: { error: "Requester is not an advisor" }, status: :bad_request
            return
        end

        @students = User.where(is_advisor: false)
    end

    private

    def user_params
        params.require(:user).permit(:username, :email, :password, :academic_year, :graduation_year, :major, :coop_cycle, :catalog_year)
    end
end