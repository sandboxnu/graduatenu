# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    Healthcheck.routes(self)
    devise_for :users, controllers: { sessions: :sessions }, path_names: { sign_in: :login }

    resources :users, only: [:show, :update] do
      resources :plans
    end
  end
end
