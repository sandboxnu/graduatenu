class PlansController < ApplicationController
  before_action :set_user
  before_action :set_searched_user, only: [:index]
  before_action :set_user_plan, only: [:show, :update, :last_viewed, :destroy, :approve, :request_approval]

  # returns all the plans
  def index
    if authorized
      @plans = @searched_user.plans
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  # shows a single plan
  def show
    if authorized
      if @plan
        render :show
      else
        render json: {error: "No such plan."}, status: :unprocessable_entity
      end
    else
      if @plan.link_sharing_enabled
        render :show
      else
        render json: {error: "Unauthorized."}, status: :unprocessable_entity
      end
    end
  end

  # creates a plan
  def create
    if authorized
      params_copy = plan_params.clone()

      if @plan = Plan.create!(params_copy)
        render :show
      else
        render json: {error: "Unable to store Plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  # updates a plan
  def update
    if authorized
      if @plan
        @plan.update(plan_params) #same body + updated fields in request body
        render :show
      else
        render json: {error: "No such plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  def last_viewed
    if authorized
      if @plan
        @plan.update(last_viewed: Time.zone.now, last_viewer: last_viewed_params[:last_viewer])
        render :show
      else
        render json: {error: "No such plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  # finds a plan by id then destroys it, just needs the id in the body
  def destroy
    if authorized
      if @plan
        @plan.destroy
        render :show
      else
        render json: {error: "No such plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end
  
  def approve
    unless @user.is_advisor
      render json: { error: "Requester is not an advisor" }, status: :bad_request
      return
    end
    if @plan
      @plan.update(approved_schedule: approve_plan_params[:approved_schedule], last_requested_approval: nil)
      student = User.find_by(id: params[:user_id])
      NotificationMailer.approved_email(@user, student, @plan).deliver
      render :show
    else
      render json: {error: "No such plan."}, status: :unprocessable_entity
    end
  end

  def request_approval
    if authorized
      if @plan
        @plan.update(last_requested_approval: Time.zone.now)
        advisor = User.find_by(email: request_approval_params[:advisor_email])
        NotificationMailer.request_approval_email(advisor, @user, @plan).deliver
        render status: 200, json: @controller.to_json
      else
        render json: {error: "No such plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  def set_primary
    if authorized
        user = User.find_by(id: params[:user_id])
        if user
          user.update(primary_plan_id: params[:id])
          render status: 200, json: @controller.to_json
        else
          render json: {error: "No such user."}, status: :unprocessable_entity
        end
    else
        render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
end

  private

  #parameters
  def plan_params
     # (schedule: {}) allows you to store an arbitrary hash with unspecified schema
    params.require(:plan).permit(:name, :link_sharing_enabled, :major, :coop_cycle, :course_counter, :catalog_year, :last_viewed,
    warnings: [:message, :termId], course_warnings: [:message, :termId, :subject, :classId], schedule: {})
  end

  def approve_plan_params
    params.require(:plan).permit(approved_schedule: {})
  end

  def request_approval_params
    params.require(:plan).permit(:advisor_email)
  end

  def last_viewed_params
    params.require(:plan).permit(:last_viewer) # a user id
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

  #sets the user whose plans are being searched for
  def set_searched_user
    if signed_in?
      @searched_user = User.find_by_id(params[:user_id])
      if @searched_user == nil
        render json: {error: "User not found."}, status: 404
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  #sets the plan for the current user
  def set_user_plan
    @plan = Plan.find_by(id: params[:id], user_id: params[:user_id]) # add error handling, when @current_user_id does not exist
  end

  def authorized
    @current_user_id == Integer(params[:user_id]) || @user.is_advisor
  end
end
