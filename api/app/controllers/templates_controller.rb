class TemplatesController < ApplicationController
  before_action :set_user
  before_action :set_searched_advisor, only: [:index]

  def index
    if authorized
      @folders = @searched_advisor.folders
    else
      render json: {error: "Unauthorized."}, status: :unprocessable_entity
    end
  end

  private

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