require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  def test_show__authorized
    user = create(:user)

    @controller.instance_variable_set(:@current_user_id, user.id)

    get :current, format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)
    assert_equal user.id, json_response['user']['id']
    assert_equal user.email, json_response['user']['email']
    # can test more keys
  end

  def test_show__unauthorized
    user = create(:user)

    @controller.instance_variable_set(:@current_user_id, '')

    get :current, format: "json"

    assert_response :unauthorized
  end

  def test_update__authorized
    user = create(:user)

    @controller.instance_variable_set(:@current_user_id, user.id)

    params = {
      user: {
        username: 'new username',
        email: 'new_email@new_email.com',
        major: 'new major',
        coop_cycle: 'new coop_cycle',
      }
    }

    put :update, params: params.merge(id: user.id), format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)
    assert_equal params[:user][:username], json_response['user']['username']
    assert_equal params[:user][:email], json_response['user']['email']
    assert_equal params[:user][:username], User.last.username
    assert_equal params[:user][:email], User.last.email
    # can test more keys
  end

  def test_update__unauthorized
    user = create(:user)

    @controller.instance_variable_set(:@current_user_id, '')

    params = {
      user: {
        username: 'new username',
        email: 'new email',
        major: 'new major',
        coop_cycle: 'new coop_cycle',
      }
    }

    put :update, params: params.merge(id: user.id), format: "json"

    assert_response :unauthorized
  end
end