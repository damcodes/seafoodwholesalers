class User < ApplicationRecord
  has_secure_password

  validates :first_name, { presence: true }
  validates :last_name, { presence: true }
  validates :email, { uniqueness: true, email_format: { :message => 'Incorrect format'} }
  validate :password, { length: { within: 6..40} }, on: :create

  has_many :orders, dependent: :destroy
  belongs_to :company

end
