require 'test_helper'

class MailControllerTest < ActionDispatch::IntegrationTest
  test "should get send" do
    get mail_send_url
    assert_response :success
  end

end
