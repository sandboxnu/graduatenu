class UsersController < ApplicationController
    before_action :authenticate_user!

    #simply render user information for authenicated user, no additional processing required.
    def current
        if @current_user_id.present?
            @current_user = User.find(@current_user_id)
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

    def students
        make sure requester is an advisor
        requester = User.find_by_id(@current_user_id)

        unless requester.is_advisor
            render json: { error: "Requester is not an advisor" }, status: :bad_request
            return
        end

        search = nil
        page = 0
        if search_params[:search].present?
            search = search_params[:search].downcase
        end
        
        if search_params[:page].present?
            page = Integer(search_params[:page])
        end
        @next_page = page + 1
        @last_page = false;

        offset = page * 50
        @students = User.select("username", "email", "nu_id").where(is_advisor: false).limit(50).offset(offset).where('lower(username) LIKE :search OR lower(email) LIKE :search OR nu_id LIKE :search', search: "%#{search}%")
        if @students.empty?
            @last_page = true
        end
    end
    
    private

    def search_params
        params.permit(:search, :page)
    end

    def user_params
        params.require(:user).permit(:username, :email, :password, 
        :academic_year, :graduation_year, :major, :coop_cycle, :nu_id, 
        courses_completed: [:subject, :course_id, :semester, :completion], 
        courses_transfer: [:subject, :course_id, :semester, :completion])
    end
end