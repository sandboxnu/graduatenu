# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    Healthcheck.routes(self)

    resources :users, only: [:update] do
      collection do
        get 'current'
        get 'all_students'
      end
      resources :plans
    end

    post 'v1/admin_hook', to: 'admin#admin_hook'
    get 'v1/entry', to: 'admin#entry'
  end
end
