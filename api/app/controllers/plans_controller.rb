class PlansController < ApplicationController

  before_action :set_user
  before_action :set_user_plan, only: [:show, :update, :destroy]

  #returns all the plans
  def index
    if authorized || @user.is_advisor
      @plans = @user.plans
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  # shows a plan
  # handled by before action
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

  #creates a plan
  def create
    if authorized
      params_copy = plan_params.clone()
      params_copy[:user_id] = @current_user_id

      if @plan = Plan.create!(params_copy)
        render :show
      else
        render json: {error: "Unable to store Plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  #update a plan
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

  #finds a plan by id then destroys it
  # #just needs the id in the body
  def destroy
    if authorized
      if @plan
        @plan.destroy()
        render :show
      else
        render json: {error: "No such plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  private

  #parameters
  def plan_params
     # (schedule: {}) allows you to store an arbitrary hash with unspecified schema
    params.require(:plan).permit(:name, :link_sharing_enabled, :major, :coop_cycle, :course_counter, :catalog_year, 
    warnings: [:message, :termId], course_warnings: [:message, :termId, :subject, :classId], schedule: {})
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

  #sets the plan for the current user
  def set_user_plan
    @plan = Plan.find_by(id: params[:id], user_id: params[:user_id]) # add error handling, when @current_user_id does not exist
  end

  def authorized
    @current_user_id == Integer(params[:user_id])
  end
end
