require 'test_helper'

class TemplatesControllerTest < ActionController::TestCase
  def test_index__authorized
    user = create(:advisor)
    folder = create(:folder, user: user)

    @controller.instance_variable_set(:@current_user_id, user.id)
    get :index, params: { user_id: user.id, search: 'My Folder', page: 0 }, format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)

    assert_equal 1, json_response['nextPage']
    assert_equal false, json_response['lastPage']
    assert_equal user.folders.count, json_response['templates'].count
    user.folders.each_with_index do |folder, i|
      assert_equal folder.id, json_response['templates'][i]['id']
      assert_equal folder.name, json_response['templates'][i]['name']
      assert_equal folder.template_plans.count, json_response['templates'][i]['templatePlans'].count

      folder.template_plans.each_with_index do |tp, j|
        assert_equal tp.id, json_response['templates'][i]['templatePlans'][j]['id']
        assert_equal tp.name, json_response['templates'][i]['templatePlans'][j]['name']
        assert_equal tp.schedule, json_response['templates'][i]['templatePlans'][j]['schedule']
      end
    end
  end

  def test_index__empty_search
    user = create(:advisor)
    folder = create(:folder, user: user)

    @controller.instance_variable_set(:@current_user_id, user.id)
    get :index, params: { user_id: user.id, search: '', page: 0 }, format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)

    assert_equal 1, json_response['nextPage']
    assert_equal false, json_response['lastPage']
    assert_equal user.folders.count, json_response['templates'].count
    user.folders.each_with_index do |folder, i|
      assert_equal folder.id, json_response['templates'][i]['id']
      assert_equal folder.name, json_response['templates'][i]['name']
      assert_equal folder.template_plans.count, json_response['templates'][i]['templatePlans'].count

      folder.template_plans.each_with_index do |tp, j|
        assert_equal tp.id, json_response['templates'][i]['templatePlans'][j]['id']
        assert_equal tp.name, json_response['templates'][i]['templatePlans'][j]['name']
        assert_equal tp.schedule, json_response['templates'][i]['templatePlans'][j]['schedule']
      end
    end
  end

  def test_index__last_page
    user = create(:advisor)

    @controller.instance_variable_set(:@current_user_id, user.id)
    get :index, params: { user_id: user.id, search: '', page: 0 }, format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)

    assert_equal 1, json_response['nextPage']
    assert json_response['lastPage']
    assert_equal user.folders.count, json_response['templates'].count
  end

  def test_index__filter
    user = create(:advisor)
    folder = create(:folder, user: user)
    new_folder = create(:folder, user: user, name: 'New Folder')

    @controller.instance_variable_set(:@current_user_id, user.id)
    get :index, params: { user_id: user.id, search: 'My Folder', page: 0 }, format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)

    assert_equal 1, json_response['nextPage']
    assert_equal false, json_response['lastPage']
    assert_equal 1, json_response['templates'].count

    assert_equal folder.id, json_response['templates'][0]['id']
    assert_equal folder.name, json_response['templates'][0]['name']
    assert_equal folder.template_plans.count, json_response['templates'][0]['templatePlans'].count

    folder.template_plans.each_with_index do |tp, j|
      assert_equal tp.id, json_response['templates'][0]['templatePlans'][j]['id']
      assert_equal tp.name, json_response['templates'][0]['templatePlans'][j]['name']
      assert_equal tp.schedule, json_response['templates'][0]['templatePlans'][j]['schedule']
    end
  end

  def test_create__new_folder
    user = create(:advisor)
    @controller.instance_variable_set(:@current_user_id, user.id)

    template_plan = build(:template_plan) # same as Model.new

    params = {
      template_plan: {
        name: template_plan.name,
        major: template_plan.major,
        coop_cycle: template_plan.coop_cycle,
        catalog_year: template_plan.catalog_year,
        schedule: template_plan.schedule,
        folder_id: nil,
        folder_name: 'My New Folder',
      }
    }

    assert_difference "Folder.count", 1 do
      assert_difference "TemplatePlan.count", 1 do
        post :create, params: params.merge(user_id: user.id), format: "json"
      end
    end

    assert_response :ok

    json_response = JSON.parse(response.body)

    tp = TemplatePlan.last
    assert_equal tp.id, json_response['templatePlan']['id']
    assert_equal tp.name, json_response['templatePlan']['name']
    assert_equal tp.schedule, json_response['templatePlan']['schedule']
  end

  def test_create__existing_folder
    user = create(:advisor)
    folder = create(:folder, user: user)
    @controller.instance_variable_set(:@current_user_id, user.id)

    template_plan = build(:template_plan) # same as Model.new

    params = {
      template_plan: {
        name: template_plan.name,
        major: template_plan.major,
        coop_cycle: template_plan.coop_cycle,
        catalog_year: template_plan.catalog_year,
        schedule: template_plan.schedule,
        folder_id: folder.id,
        folder_name: nil,
      }
    }

    assert_no_difference "Folder.count" do
      assert_difference "TemplatePlan.count", 1 do
        post :create, params: params.merge(user_id: user.id), format: "json"
      end
    end

    assert_response :ok

    json_response = JSON.parse(response.body)

    tp = TemplatePlan.last
    assert_equal tp.id, json_response['templatePlan']['id']
    assert_equal tp.name, json_response['templatePlan']['name']
    assert_equal tp.schedule, json_response['templatePlan']['schedule']
  end
end