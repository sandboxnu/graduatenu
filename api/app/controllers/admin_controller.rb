class AdminController < ApplicationController
  LOGIN_TOKEN_EXPIRATION = 7.days # TODO: set to 5 minutes
  skip_before_action :authenticate_user

  # log in through khoury
  def admin_hook
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
      email: user_params[:email],
      is_advisor: user_params[:is_advisor],
      major: user_params[:major],
      username: user_params[:first_name] + ' ' + user_params[:last_name],
      image_url: user_params[:photo_url],
      # TODO: do we need to update courses here?
    )
      render json: { errors: @user.errors }, status: :unprocessable_entity
      return true
    end
  end

  def create_new_user
    # add nuid
    @user = User.new(
      email: user_params[:email],
      password: 'test123', # remove after transition
      is_advisor: user_params[:is_advisor],
      major: user_params[:major],
      username: user_params[:first_name] + ' ' + user_params[:last_name],
      image_url: user_params[:photo_url],
      completed_courses: [],
    )

    unless @user.save
      render json: { errors: @user.errors }, status: :unprocessable_entity
      return true
    end

    # set completed courses
    courses = []
    (user_params[:courses] || []).each do |c|
      split = c[:course].split(" ")
      subject = split[0]
      class_id = split[1]
      course = Course.new(subject: subject, class_id: class_id)

      unless course.save
        render json: { errors: course.errors }, status: :unprocessable_entity
        return true
      end

      @user.reload
      course.reload
      @user.completed_courses << course
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
    params.permit(:email, :is_advisor, :major, :first_name, :last_name, :photo_url, :nuid, :courses)
  end
end