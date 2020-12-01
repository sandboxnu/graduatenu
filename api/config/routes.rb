# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    Healthcheck.routes(self)
    # devise_for :users, controllers: { sessions: :sessions, passwords: :passwords }, path_names: { sign_in: :login }

    resources :users, only: [:update] do
      collection do
        get 'students'
        get 'current'
      end
      resources :plans
    end

    post 'v1/admin_hook', to: 'admin#admin_hook'
    get 'v1/entry', to: 'admin#entry'
  end
end
