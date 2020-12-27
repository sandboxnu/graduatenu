class TemplatesController < ApplicationController
  before_action :set_user
  before_action :set_searched_advisor, only: [:index]

  def index
    unless authorized
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
    @folders = Folder.joins(:template_plans).where('folders.user_id = ?', @searched_advisor.id).limit(50).offset(offset).where('lower(folders.name) LIKE :search OR lower(template_plans.name) LIKE :search OR lower(template_plans.major) LIKE :search OR lower(template_plans.coop_cycle) LIKE :search', search: "%#{search}%").distinct

    @last_page = true if @folders.empty?
  end

  def create
    if authorized
      params_copy = template_plan_params.clone()
      folder_id = params_copy[:folder_id]
      folder = Folder.find_by_id(folder_id)

      if folder.blank?
        folder = Folder.create!({
          user_id: params[:user_id], # root params
          name: params_copy[:folder_name]
        })
      end

      params_copy[:folder_id] = folder.id
      if @template_plan = TemplatePlan.create!(params_copy.except(:folder_name))
        render :show
      else
        render json: {error: "Unable to store Template Plan."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  private

  def search_params
    params.permit(:search, :page)
  end

  def template_plan_params
   params.require(:template_plan).permit(:name, :major, :coop_cycle, :catalog_year, :folder_id, :folder_name, :schedule)
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

  #sets the user whose templates are being searched for (in most cases, their own)
  def set_searched_advisor
    if signed_in?
      @searched_advisor = User.find_by_id(params[:user_id])
      if @searched_advisor == nil
        return render json: {error: "User not found."}, status: 404
      end
      unless @searched_advisor.is_advisor
        return render json: {error: "User is not an advisor."}, status: :unprocessable_entity
      end
    else
      return render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  def authorized
    @user.is_advisor
  end
end