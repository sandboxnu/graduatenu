require 'test_helper'

class PlansControllerTest < ActionController::TestCase
  def test_index__authorized
    user = create(:user)
    plan = create(:plan, user: user)

    @controller.instance_variable_set(:@current_user_id, user.id)
    get :index, params: { user_id: user.id }, format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)
    assert_equal user.plans.count, json_response.count
    user.plans.each_with_index do |plan, i|
      assert_equal plan.id, json_response[i]['id']
      assert_equal plan.name, json_response[i]['name']
      # can test more keys
    end
  end

  def test_index__unauthorized
    user = create(:user)
    plan = create(:plan, user: user)

    @controller.instance_variable_set(:@current_user_id, '')
    get :index, params: { user_id: user.id }

    assert_response :unprocessable_entity
    assert_equal ({ error: "Unauthorized." }).to_json, response.body
  end

  def test_create__authorized
    user = create(:user)

    @controller.instance_variable_set(:@current_user_id, user.id)

    params = {
      plan: {
        name: "Plan 1",
        link_sharing_enabled: false,
        schedule: {},
        major: 'Computer Science',
        coop_cycle: '4 years',
        course_counter: 1,
        warnings: [],
        course_warnings: [],
      },
    }

    assert_difference "Plan.count", 1 do
      post :create, params: params.merge(user_id: user.id), format: "json"
    end

    assert_response :ok

    json_response = JSON.parse(response.body)
    assert_equal params[:plan][:name], json_response['plan']['name']
    assert_equal params[:plan][:major], json_response['plan']['major']
    # can test more keys
  end

  def test_create__unauthorized
    user = create(:user)

    @controller.instance_variable_set(:@current_user_id, '')

    params = {
      plan: {
        name: "Plan 1",
        link_sharing_enabled: false,
        schedule: {},
        major: 'Computer Science',
        coop_cycle: '4 years',
        course_counter: 1,
        warnings: [],
        course_warnings: [],
      },
    }

    post :create, params: params.merge(user_id: user.id), format: "json"

    assert_response :unprocessable_entity
    assert_equal ({ error: "Unauthorized." }).to_json, response.body
  end

  def test_update__authorized
    user = create(:user)
    plan = create(:plan, user: user)

    @controller.instance_variable_set(:@current_user_id, user.id)

    params = {
      plan: {
        name: "Plan 1",
        link_sharing_enabled: false,
        schedule: {},
        major: 'Computer Science',
        coop_cycle: '4 years',
        course_counter: 1,
        warnings: [],
        course_warnings: [],
      },
    }

    assert_no_difference "Plan.count" do
      put :update, params: params.merge(user_id: user.id, id: plan.id), format: "json"
    end

    assert_response :ok

    json_response = JSON.parse(response.body)
    assert_equal params[:plan][:name], json_response['plan']['name']
    assert_equal params[:plan][:major], json_response['plan']['major']
    assert_equal params[:plan][:name], Plan.last.name
    assert_equal params[:plan][:major], Plan.last.major
    # can test more keys
  end

  def test_update__unauthorized
    user = create(:user)
    plan = create(:plan, user: user)

    @controller.instance_variable_set(:@current_user_id, '')

    params = {
      plan: {
        name: "Plan 1",
        link_sharing_enabled: false,
        schedule: {},
        major: 'Computer Science',
        coop_cycle: '4 years',
        course_counter: 1,
        warnings: [],
        course_warnings: [],
      },
    }

    put :update, params: params.merge(user_id: user.id, id: plan.id), format: "json"

    assert_response :unprocessable_entity
    assert_equal ({ error: "Unauthorized." }).to_json, response.body
  end

  def test_destroy__authorized
    user = create(:user)
    plan = create(:plan, user: user)

    @controller.instance_variable_set(:@current_user_id, user.id)

    assert_difference "Plan.count", -1 do
      delete :destroy, params: { user_id: user.id, id: plan.id }, format: "json"
    end

    assert_response :ok
  end

  def test_destroy__unauthorized
    user = create(:user)
    plan = create(:plan, user: user)

    @controller.instance_variable_set(:@current_user_id, '')

    assert_no_difference "Plan.count" do
      delete :destroy, params: { user_id: user.id, id: plan.id }, format: "json"
    end

    assert_response :unprocessable_entity
    assert_equal ({ error: "Unauthorized." }).to_json, response.body
  end
end