class CompaniesController < ApplicationController
  before_action :set_company, only: [:show, :update, :destroy]
  skip_before_action :authorized, only: [:index]

  # GET /companies
  def index
    @companies = Company.all

    render json: CompanySerializer.new(@companies).serialize
  end

  # GET /companies/1
  def show
    render json: CompanySerializer.new(@company).serialize
  end

  # POST /companies
  def create
    @company = Company.new(company_params)

    if @company.save
      render json: CompanySerializer.new(@company).serialize, status: :created, location: @company
    else
      render json: @company.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /companies/1
  def update
    if @company.update(company_params)
      render json: CompanySerializer.new(@company).serialize
    else
      render json: @company.errors, status: :unprocessable_entity
    end
  end

  # DELETE /companies/1
  def destroy
    @company.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_company
      @company = Company.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def company_params
      params.require(:company).permit(:name, :address)
    end
end
