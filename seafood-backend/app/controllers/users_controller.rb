class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
  skip_before_action :authorized, only: [:create, :index, :get_current_user]

  # GET /users
  def index
    @users = User.all

    render json: UserSerializer.new(@users).serialize
  end

  # GET /users/1
  def show
    render json: UserSerializer.new(@user).serialize
  end

  # POST /users
  def create
    company = Company.find_by(name: user_params[:company])
    @user = User.new(first_name: user_params[:first_name], last_name: user_params[:last_name], 
                      email: user_params[:email], password: user_params[:password], company: company, password_confirmation: user_params[:password_confirmation])

    if @user.save
      token = encode_token(user_id: @user.id)
      render json: { jwt: token }, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: UserSerializer.new(@user).serialize
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  def get_current_user 
    @user = User.find_by(id: current_user.id)
    render json: UserSerializer.new(@user).serialize
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :company, :password, :password_confirmation, :admin)
    end
end
