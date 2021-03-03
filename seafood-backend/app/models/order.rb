class Order < ApplicationRecord
  belongs_to :user
  belongs_to :route

  has_many :order_products
  has_many :products, through: :order_products, dependent: :destroy
end
