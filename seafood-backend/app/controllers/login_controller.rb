class LoginController < ApplicationController
  skip_before_action :authorized, only: [:create]

  def create
    user = User.find_by(email: login_creds[:email])
    if user && user.authenticate(login_creds[:password])
      token = encode_token({ user_id: user.id })
      render json: { jwt: token, user: UserSerializer.new(user).serialize }, status: :accepted
    else
      render json: { message: "Incorrect username or password" }, status: :unauthorized
    end
  end

  private
  def login_creds
    params.require(:user).permit(:email, :password)
  end

end