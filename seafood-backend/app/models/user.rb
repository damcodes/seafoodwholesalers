class User < ApplicationRecord
  has_secure_password

  validates :email, { uniqueness: true }

  has_many :orders, dependent: :destroy
  belongs_to :company
end
