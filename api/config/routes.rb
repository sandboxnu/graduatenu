# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    devise_for :users, controllers: { sessions: :sessions }, path_names: { sign_in: :login }

    resource :user, only: [:show, :update]

    resource :plan, only: [:create, :delete, :update, :show, :index]
  end
end
