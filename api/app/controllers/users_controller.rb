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

    private

    def user_params
        params.require(:user).permit(:username, :email, :password, :academic_year, :graduation_year, :major, :coop_cycle, :catalog_year)
    end
end