require 'test_helper'

class TemplatesControllerTest < ActionController::TestCase
  def test_index__authorized
    user = create(:advisor)
    folder = create(:folder, user: user)

    @controller.instance_variable_set(:@current_user_id, user.id)
    get :index, params: { user_id: user.id }, format: "json"

    assert_response :ok

    json_response = JSON.parse(response.body)

    assert_equal user.folders.count, json_response.count
    user.folders.each_with_index do |folder, i|
      assert_equal folder.id, json_response[i]['id']
      assert_equal folder.name, json_response[i]['name']
      assert_equal folder.template_plans.count, json_response[i]['templatePlans'].count

      folder.template_plans.each_with_index do |tp, j|
        assert_equal tp.id, json_response[i]['templatePlans'][j]['id']
        assert_equal tp.name, json_response[i]['templatePlans'][j]['name']
        assert_equal tp.schedule, json_response[i]['templatePlans'][j]['schedule']
      end
    end
  end
end