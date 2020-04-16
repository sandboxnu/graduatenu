class PlansController < ApplicationController

  before_action :set_user
  before_action :set_user_plan, only: [:show, :update, :destroy]

  #returns all the plans
  def index
    @plans = Plan.where(user_id: @current_user_id)
  end

  #shows a
  # handled by before action
  def show
    if @plan
      render :show
    else
      render json: {error: "No such plan."}, status: :unprocessable_entity
    end
  end

  #creates a plan
  def create
    @plan = Plan.new(plan_params)
    @plan.schedule = params[:plan][:schedule]
    @plan.user_id = @current_user_id


    if @plan.save!
      render :show
    else
      render json: {error: "Cannot make Plan."}, status: :unprocessable_entity
    end
    #@user.plans.create!(plan_params)
    #params_copy = plan_params.clone()
    #params_copy[:user_id] = @current_user_id

    #params_copy[:schedule] = params[:plan ][:schedule]

    #@plan = Plan.create!(params_copy)
  end

  #update a plan
  def update
    @plan.update(plan_params) #same body + updated fields in request body
    render :show
  end

  #finds a plan by id then destroys it
  # #just needs the id in the body
  def destroy
    if @plan
      @plan.destroy()
      render :show
    else
      render json: {error: "No such plan."}, status: :unprocessable_entity
    end
  end

  private

  #parameters
  def plan_params
    #params.require(:plan).permit(:name, :link_sharing_enabled).tap do |whitelisted|
    #  whitelisted[:schedule] = params[:plan][:schedule]
    #end
    params.require(:plan).permit(:name, :link_sharing_enabled, :schedule => Hash)
  end

  #sets the current user
  def set_user
    @user = User.find(@current_user_id)
  end

  #sets the plan for the current user
  def set_user_plan
    @plan = Plan.find_by(id: params[:id], user_id: @current_user_id)
  end
end
