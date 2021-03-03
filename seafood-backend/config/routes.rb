Rails.application.routes.draw do
  resources :companies
  resources :routes
  resources :order_products
  resources :orders
  resources :products
  resources :users
  resources :login, only: [:create]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '/current-user', to: 'users#get_current_user'
  # get '/orders/:order_number', to: "orders#get_order"

end
