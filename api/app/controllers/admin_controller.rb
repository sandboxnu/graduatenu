class AdminController < ApplicationController
  LOGIN_TOKEN_EXPIRATION = 5.minutes
  skip_before_action :authenticate_user

  # log in through khoury
  def admin_hook
    p '====================================='
    p user_params[:courses]
    error = false
    # see if user is already in our db
    if User.exists?(email: user_params[:email])
      error = update_existing_user
    else
      error = create_new_user
    end

    return if error

    redirect_url = ENV['ROOT_URL'] + '/api/v1/entry?user_id=' + generate_login_token

    render json: { redirect: redirect_url }, status: :ok
  end

  def entry
    token = params[:user_id]
    user_id = decode_login_token(token)
    @user = User.find_by_id(user_id)

    if @user.nil?
      render json: { errors: "User does not exist with id: #{user_id}" }, status: :unprocessable_entity
      return
    end

    redirect_url = ENV['FRONTEND_URL'] + '/redirect'

    response.set_cookie(
      :auth_token,
      {
        value: token,
        secure: ENV['FRONTEND_URL'].start_with?("https"),
        httponly: false,
        path: '/redirect', # the frontend path that will receive this cookie
       }
    )
    redirect_to redirect_url
  end

  private

  def update_existing_user
    @user = User.find_by(email: user_params[:email])

    unless @user.update(
      nu_id: user_params[:nu_id],
      is_advisor: user_params[:is_advisor],
      major: "test123",
      username: user_params[:first_name] + ' ' + user_params[:last_name],
      image_url: user_params[:photo_url],
      courses_transfer: user_params[:courses].select { |a| a['completion'] == 'TRANSFER' },
      courses_completed: user_params[:courses].select { |a| a['completion'] == 'PASSED' },
      # TODO: do we need to update courses here?
    )
      render json: { errors: @user.errors }, status: :unprocessable_entity
      return true
    end
  end

  def create_new_user
    @user = User.new(
      email: user_params[:email],
      nu_id: user_params[:nu_id],
      is_advisor: user_params[:is_advisor],
      major: user_params[:major],
      username: user_params[:first_name] + ' ' + user_params[:last_name],
      image_url: user_params[:photo_url],
      courses_transfer: user_params[:courses].select { |a| a['completion'] == 'TRANSFER' },
      courses_completed: user_params[:courses].select { |a| a['completion'] == 'PASSED' },
    )

    unless @user.save
      render json: { errors: @user.errors }, status: :unprocessable_entity
      return true
    end
  end

  def generate_login_token
    JWT.encode({ id: @user.id, exp: LOGIN_TOKEN_EXPIRATION.from_now.to_i }, Rails.application.credentials.secret_key_base)
  end

  # returns user id
  def decode_login_token(token)
    JWT.decode(token, Rails.application.credentials.secret_key_base).first['id']
  end

  # user data from khoury
  def user_params
    params.require(:admin).permit(:email, :is_advisor, :major, :first_name, :last_name, :photo_url, :nu_id, courses: [:subject, :course_id, :semester, :completion])
  end
end