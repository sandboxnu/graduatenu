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

  private

  def search_params
    params.permit(:search, :page)
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