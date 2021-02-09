class UsersController < ApplicationController
    before_action :authenticate_user!

    # simply render user information for authenicated user, no additional processing required.
    def current
        if @current_user_id.present?
            @current_user = User.find(@current_user_id)
            @user = @current_user
            render :show
        else
            render json: { error: "Unauthorized" }, status: :unprocessable_entity
        end
    end

    # update a user
    def update
        if @current_user_id == Integer(params[:id])
            if current_user.update(user_params)
                @user = @current_user
                render :show
            else
                render json: { error: current_user.errors }, status: :unprocessable_entity
            end
        else
            render json: { error: "Unauthorized" }, status: :unprocessable_entity
        end
    end

    # returns all information for one student
    def show
        # make sure requester is an advisor
        requester = User.find_by_id(@current_user_id)
        unless requester.is_advisor
            render json: { error: "Requester is not an advisor" }, status: :bad_request
            return
        end

        @user = User.find_by_id(Integer(params[:id]))
        if @user == nil
            render json: {error: "User not found."}, status: 404
        end

        render :show
    end

    def students
        # make sure requester is an advisor
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

        offset = page * 2
        students = User.where(is_advisor: false).where('lower(full_name) LIKE :search', search: "%#{search}%").or(User.where(is_advisor: false, email: search)).or(User.where(is_advisor: false, nu_id: search))
        @students = students.slice(offset, 2)
        if @students.length < 2
            @last_page = true
        end
    end

    def advisors
        @advisors = User.where(is_advisor: true)
    end

    private

    def search_params
        params.permit(:search, :page)
    end

    def user_params
        params.require(:user).permit(:full_name, :email, :password,
        :academic_year, :graduation_year, :major, :coop_cycle, :concentration, :nu_id, :catalog_year,
        courses_completed: [:subject, :course_id, :semester, :completion],
        courses_transfer: [:subject, :course_id, :semester, :completion])
    end
end