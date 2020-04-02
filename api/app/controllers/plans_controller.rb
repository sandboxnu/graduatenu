class PlansController < ApplicationController

  before_action :set_user
  before_action :set_user_plan, only: [:show, :update, :destroy]

  #returns all the plans
  def index
    @user.plans
  end

  #shows a plan
  def show
    @plan
  end

  #creates a plan
  def create
    @user.plans.create!(plan_params)
    render :show
  end

  #update a plan
  def update
    @plan.update(plan_params)
    render :show
  end

  #finds a plan by id then destroys it
  def destroy
    @plan.destroy()
    render :show
  end

  private

  #parameters
  def plan_params
    params.require(:user).permit(:name, :link_sharing_enabled, :schedule)
  end

  #sets the current user
  def set_user
    @user = User.find(params[:id])
  end

  #sets the plan for this user
  def set_user_plan
    @plan = @user.items.find_by!(id: params[:id]) if @user
  end
end
